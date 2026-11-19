# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""The three graphs Kalliope runs, written over the official modules and weights (made in V-4, 19/11/2026).

Every step keeps its streaming state in explicit tensors, so that ONNX Runtime can run it and the
caller (Kalliope, in Rust) owns the state:

- FlowStep: one call of the flow LM. Inputs: text tokens [1,N], voice conditioning [1,V,1024], latents
  [1,S,32] (NaN = start), noise [1,32], and per layer the past keys and values [1,16,P,64]. Text, voice
  and latents are concatenated in this order, as in TTSModel._run_flow_lm. Outputs: the next latent
  (one LSD step from the noise, s=0 and t=1, as lsd_decode with sampler_decode_steps=1), the EOS logit,
  and the present keys and values (past + new). The RoPE position is the past length, so there is no
  offset input and no fixed-size cache: the cache is exactly what has been seen (V-1: the fixed cache of
  1000 positions cost 63% of the time).
- MimiDecoderStep: latents [1,T,32] -> audio [1,1,T*1920], with the state of every causal convolution,
  of the transposed convolutions and of the two transformer layers (keys and values of the last 249
  positions: the context is 250) plus the absolute position.
- MimiEncoderStep: audio [1,1,k*1920] -> voice conditioning [1,k,1024] (encoder, encoder transformer,
  downsample, speaker projection), with the same kind of state. Fed piece by piece it gives what
  TTSModel._encode_audio gives on the whole recording, with memory that does not grow with its length
  (the whole recording at once needs the attention over all 200 Hz positions: 3.9 GB for 25 s in V-1).
  Also outputs bos_before_voice, to put in front of the voice.

The arithmetic is the official one: modules.attention, modules.transformer, modules.conv, modules.rope,
models.flow_lm, models.mimi (kyutai-labs/pocket-tts a4a6054d).
"""
from __future__ import annotations

import torch
from torch import nn
from torch.nn import functional as F

DEC_CONTEXT = 250  # Mimi transformer context (config: mimi.transformer.context)


def _rope(q: torch.Tensor, k: torch.Tensor, offset, max_period: float):
    from pocket_tts.modules.rope import apply_rope
    return apply_rope(q, k, offset=offset, max_period=max_period)


def layer_step(layer, x: torch.Tensor, pk: torch.Tensor, pv: torch.Tensor, offset, window: int | None):
    """One StreamingTransformerLayer over x [B,T,C] with explicit past keys/values [B,H,P,D].

    Returns the output, and the present keys/values (past + new, then the last window-1 positions when
    the layer has a context window). `offset` is the absolute position of x's first step.
    """
    attn = layer.self_attn
    h_in = layer.norm1(x)
    projected = attn.in_proj(h_in)
    b, t, _ = projected.shape
    d, nh, nkv = attn.dim_per_head, attn.num_heads, attn.num_kv_heads
    q = projected[..., : attn.attn_dim].view(b, t, nh, d)
    kv = projected[..., attn.attn_dim:].view(b, t, 2, nkv, d)
    k, v = torch.unbind(kv, dim=2)
    q, k = _rope(q, k, offset, attn.rope.max_period)
    q = q.transpose(1, 2)
    k = k.transpose(1, 2)
    v = v.transpose(1, 2)
    keys = torch.cat([pk, k], dim=2)
    values = torch.cat([pv, v], dim=2)
    p = pk.shape[2]
    # Absolute positions: keys offset-p .. offset+t-1, queries offset .. offset+t-1.
    pos_k = torch.arange(p + t, device=x.device) - p
    pos_q = torch.arange(t, device=x.device)
    delta = pos_q[:, None] - pos_k[None, :]
    mask = delta >= 0
    if window is not None:
        mask = mask & (delta < window)
    out = F.scaled_dot_product_attention(q, keys, values, attn_mask=mask[None, None])
    out = out.transpose(1, 2).reshape(b, t, nh * d)
    x = x + layer.layer_scale_1(attn.out_proj(out))
    h = layer.norm2(x)
    x = x + layer.layer_scale_2(layer.linear2(F.gelu(layer.linear1(h), approximate="tanh")))
    if window is not None:
        keep = window - 1
        keys = keys[:, :, -keep:]
        values = values[:, :, -keep:]
    return x, keys, values


class FlowStep(nn.Module):
    def __init__(self, flow_lm):
        super().__init__()
        self.f = flow_lm

    def forward(self, text_tokens, voice, sequence, noise, *past):
        f = self.f
        text = f.conditioner(text_tokens)
        seq = torch.where(torch.isnan(sequence), f.bos_emb.to(sequence.dtype), sequence)
        x = torch.cat([text, voice, f.input_linear(seq)], dim=1)
        offset = past[0].shape[2]
        presents = []
        for i, layer in enumerate(f.transformer.layers):
            x, k, v = layer_step(layer, x, past[2 * i], past[2 * i + 1], offset, None)
            presents += [k, v]
        h = f.out_norm(x)[:, -1]
        eos = f.out_eos(h)
        s = torch.zeros_like(noise[:, :1])
        latent = noise + f.flow_net(h, s, s + 1.0, noise)
        return (latent, eos, *presents)


def _conv_step(m, x, prev):
    """StreamingConv1d (constant padding) with explicit previous samples."""
    if prev.shape[-1] == 0:
        return m.conv(x), prev
    x = torch.cat([prev, x], dim=-1)
    return m.conv(x), x[..., -prev.shape[-1]:]


def _convtr_step(m, x, partial):
    """StreamingConvTranspose1d with explicit overlap carried to the next call."""
    y = m.convtr(x)
    pt = partial.shape[-1]
    n = y.shape[-1] - pt
    out = torch.cat([y[..., :pt] + partial, y[..., pt:n]], dim=-1)
    rest = y[..., n:]
    if m.convtr.bias is not None:
        rest = rest - m.convtr.bias[:, None]
    return out, rest


def _conv_states(seq_modules):
    """Shapes of the explicit states of a SEANet model list, in call order."""
    from pocket_tts.modules.conv import StreamingConv1d, StreamingConvTranspose1d
    from pocket_tts.modules.seanet import SEANetResnetBlock
    shapes = []
    for layer in seq_modules:
        if isinstance(layer, StreamingConv1d):
            shapes.append(("conv", layer.conv.in_channels, layer._effective_kernel_size - layer._stride))
        elif isinstance(layer, StreamingConvTranspose1d):
            shapes.append(("convtr", layer.convtr.out_channels, layer._kernel_size - layer._stride))
        elif isinstance(layer, SEANetResnetBlock):
            for sub in layer.block:
                if isinstance(sub, StreamingConv1d):
                    shapes.append(("conv", sub.conv.in_channels, sub._effective_kernel_size - sub._stride))
    return shapes


def _seanet_step(seq_modules, x, states):
    from pocket_tts.modules.conv import StreamingConv1d, StreamingConvTranspose1d
    from pocket_tts.modules.seanet import SEANetResnetBlock
    it = iter(states)
    new = []
    for layer in seq_modules:
        if isinstance(layer, StreamingConv1d):
            x, s = _conv_step(layer, x, next(it))
            new.append(s)
        elif isinstance(layer, StreamingConvTranspose1d):
            x, s = _convtr_step(layer, x, next(it))
            new.append(s)
        elif isinstance(layer, SEANetResnetBlock):
            v = x
            for sub in layer.block:
                if isinstance(sub, StreamingConv1d):
                    v, s = _conv_step(sub, v, next(it))
                    new.append(s)
                else:
                    v = sub(v)
            x = x + v
        else:
            x = layer(x)
    return x, new


class MimiDecoderStep(nn.Module):
    """Inputs: latent [1,T,32], offset [1] (int64), then the states listed by `state_shapes`."""

    def __init__(self, mimi, emb_std, emb_mean):
        super().__init__()
        self.m = mimi
        self.register_buffer("emb_std", emb_std.detach().clone())
        self.register_buffer("emb_mean", emb_mean.detach().clone())

    def state_shapes(self):
        m = self.m
        out = [("partial", m.upsample.convtr.convtr.out_channels,
                m.upsample.convtr._kernel_size - m.upsample.convtr._stride)]
        tr = m.decoder_transformer.transformer
        for _ in tr.layers:
            a = tr.layers[0].self_attn
            out += [("key", a.num_kv_heads, a.dim_per_head), ("value", a.num_kv_heads, a.dim_per_head)]
        out += _conv_states(m.decoder.model)
        return out

    def forward(self, latent, offset, *states):
        m = self.m
        z = latent * self.emb_std + self.emb_mean
        z = m.quantizer(z.transpose(1, 2))
        z, partial = _convtr_step(m.upsample.convtr, z, states[0])
        tr = m.decoder_transformer.transformer
        y = z.transpose(1, 2)
        kv = []
        pos = offset.to(torch.float32)
        for i, layer in enumerate(tr.layers):
            y, k, v = layer_step(layer, y, states[1 + 2 * i], states[2 + 2 * i], pos, DEC_CONTEXT)
            kv += [k, v]
        z = y.transpose(1, 2)
        n_tr = 1 + 2 * len(tr.layers)
        audio, conv = _seanet_step(m.decoder.model, z, states[n_tr:])
        return (audio, offset + y.shape[1], partial, *kv, *conv)


class MimiEncoderStep(nn.Module):
    """Inputs: audio [1,1,k*1920], offset [1] (int64), first [1] (1.0 on the first piece), then the states."""

    def __init__(self, mimi, speaker_proj, bos_before_voice):
        super().__init__()
        self.m = mimi
        self.register_buffer("speaker_proj", speaker_proj.detach().clone())
        self.register_buffer("bos", bos_before_voice.detach().clone())

    def state_shapes(self):
        m = self.m
        out = _conv_states(m.encoder.model)
        tr = m.encoder_transformer.transformer
        for _ in tr.layers:
            a = tr.layers[0].self_attn
            out += [("key", a.num_kv_heads, a.dim_per_head), ("value", a.num_kv_heads, a.dim_per_head)]
        d = m.downsample.conv
        out.append(("conv", d.conv.in_channels, d._effective_kernel_size - d._stride))
        return out

    def forward(self, audio, offset, first, *states):
        m = self.m
        n_conv = len(_conv_states(m.encoder.model))
        x, conv = _seanet_step(m.encoder.model, audio, states[:n_conv])
        tr = m.encoder_transformer.transformer
        y = x.transpose(1, 2)
        kv = []
        pos = offset.to(torch.float32)
        for i, layer in enumerate(tr.layers):
            y, k, v = layer_step(layer, y, states[n_conv + 2 * i], states[n_conv + 1 + 2 * i], pos, DEC_CONTEXT)
            kv += [k, v]
        x = y.transpose(1, 2)
        # ConvDownsample1d, replicate padding: on the first piece the past is the first frame repeated.
        prev = states[-1]
        prev = torch.where(first.view(1, 1, 1) > 0.5, x[..., :1].expand_as(prev), prev)
        x = torch.cat([prev, x], dim=-1)
        new_prev = x[..., -prev.shape[-1]:]
        lat = m.downsample.conv.conv(x)
        cond = F.linear(lat.transpose(1, 2), self.speaker_proj)
        return (cond, self.bos, offset + y.shape[1], *conv, *kv, new_prev)
