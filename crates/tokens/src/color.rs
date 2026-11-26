// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! CSS colours to 8-bit sRGB, as a browser paints them: hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(),
//! oklch(), color(srgb …), color-mix() and a few names. A colour outside the sRGB gamut is clipped
//! channel by channel, as Chromium paints it.

/// Straight (not premultiplied) sRGB, components 0..1, alpha 0..1. May lie outside the gamut until mapped.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Srgb {
    pub r: f64,
    pub g: f64,
    pub b: f64,
    pub a: f64,
}

/// One colour in 8-bit sRGB, as Slint stores it.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Rgba8 {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

impl Rgba8 {
    /// `#rrggbb`, or `#rrggbbaa` when not opaque: both are Slint colour literals.
    pub fn to_slint(self) -> String {
        if self.a == 255 {
            format!("#{:02x}{:02x}{:02x}", self.r, self.g, self.b)
        } else {
            format!("#{:02x}{:02x}{:02x}{:02x}", self.r, self.g, self.b, self.a)
        }
    }
}

fn to_u8(v: f64) -> u8 {
    (v.clamp(0.0, 1.0) * 255.0 + 0.5).floor() as u8
}

impl Srgb {
    fn clipped(&self) -> Srgb {
        Srgb {
            r: self.r.clamp(0.0, 1.0),
            g: self.g.clamp(0.0, 1.0),
            b: self.b.clamp(0.0, 1.0),
            a: self.a,
        }
    }
    pub fn to_rgba8(&self) -> Rgba8 {
        let c = self.clipped();
        Rgba8 {
            r: to_u8(c.r),
            g: to_u8(c.g),
            b: to_u8(c.b),
            a: to_u8(self.a),
        }
    }
}

// ---- transfer function and matrices -------------------------------------------------------------

fn to_linear(c: f64) -> f64 {
    let a = c.abs();
    let l = if a <= 0.04045 {
        a / 12.92
    } else {
        ((a + 0.055) / 1.055).powf(2.4)
    };
    l.copysign(c)
}
fn from_linear(c: f64) -> f64 {
    let a = c.abs();
    let g = if a <= 0.0031308 {
        a * 12.92
    } else {
        1.055 * a.powf(1.0 / 2.4) - 0.055
    };
    g.copysign(c)
}

type V3 = [f64; 3];
fn mul(m: &[[f64; 3]; 3], v: V3) -> V3 {
    [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
    ]
}

const OKLAB_LMS_TO_LAB: [[f64; 3]; 3] = [
    [0.2104542553, 0.7936177850, -0.0040720468],
    [1.9779984951, -2.4285922050, 0.4505937099],
    [0.0259040371, 0.7827717662, -0.8086757660],
];
const LINEAR_TO_LMS: [[f64; 3]; 3] = [
    [0.4122214708, 0.5363325363, 0.0514459929],
    [0.2119034982, 0.6806995451, 0.1073969566],
    [0.0883024619, 0.2817188376, 0.6299787005],
];
const OKLAB_TO_LMS: [[f64; 3]; 3] = [
    [1.0, 0.3963377774, 0.2158037573],
    [1.0, -0.1055613458, -0.0638541728],
    [1.0, -0.0894841775, -1.2914855480],
];
const LMS_TO_LINEAR: [[f64; 3]; 3] = [
    [4.0767416621, -3.3077115913, 0.2309699292],
    [-1.2684380046, 2.6097574011, -0.3413193965],
    [-0.0041960863, -0.7034186147, 1.7076147010],
];
// XYZ (D50) to linear sRGB, with the Bradford adaptation CSS Color 4 uses.
const XYZ50_TO_LINEAR: [[f64; 3]; 3] = [
    [3.1341359569958707, -1.6173863321612538, -0.4906619460083532],
    [-0.978795502912089, 1.916254567259524, 0.03344273116131949],
    [0.07195537988411677, -0.2289768264158322, 1.405386058324125],
];
const LINEAR_TO_XYZ50: [[f64; 3]; 3] = [
    [0.4360747, 0.3850649, 0.1430804],
    [0.2225045, 0.7168786, 0.0606169],
    [0.0139322, 0.0971045, 0.7141733],
];

pub fn oklab_to_linear(l: f64, a: f64, b: f64) -> V3 {
    let lms = mul(&OKLAB_TO_LMS, [l, a, b]);
    mul(
        &LMS_TO_LINEAR,
        [lms[0].powi(3), lms[1].powi(3), lms[2].powi(3)],
    )
}
pub fn linear_to_oklab(rgb: V3) -> V3 {
    let lms = mul(&LINEAR_TO_LMS, rgb);
    mul(
        &OKLAB_LMS_TO_LAB,
        [lms[0].cbrt(), lms[1].cbrt(), lms[2].cbrt()],
    )
}
fn lab_to_linear(l: f64, a: f64, b: f64) -> V3 {
    const KAPPA: f64 = 24389.0 / 27.0;
    const EPS: f64 = 216.0 / 24389.0;
    let fy = (l + 16.0) / 116.0;
    let fx = a / 500.0 + fy;
    let fz = fy - b / 200.0;
    let cube = |f: f64| {
        if f.powi(3) > EPS {
            f.powi(3)
        } else {
            (116.0 * f - 16.0) / KAPPA
        }
    };
    let y = if l > KAPPA * EPS {
        fy.powi(3)
    } else {
        l / KAPPA
    };
    let white = [0.3457 / 0.3585, 1.0, (1.0 - 0.3457 - 0.3585) / 0.3585];
    mul(
        &XYZ50_TO_LINEAR,
        [cube(fx) * white[0], y * white[1], cube(fz) * white[2]],
    )
}
fn linear_to_lab(rgb: V3) -> V3 {
    const KAPPA: f64 = 24389.0 / 27.0;
    const EPS: f64 = 216.0 / 24389.0;
    let white = [0.3457 / 0.3585, 1.0, (1.0 - 0.3457 - 0.3585) / 0.3585];
    let xyz = mul(&LINEAR_TO_XYZ50, rgb);
    let f = |t: f64| {
        if t > EPS {
            t.cbrt()
        } else {
            (KAPPA * t + 16.0) / 116.0
        }
    };
    let (fx, fy, fz) = (
        f(xyz[0] / white[0]),
        f(xyz[1] / white[1]),
        f(xyz[2] / white[2]),
    );
    [116.0 * fy - 16.0, 500.0 * (fx - fy), 200.0 * (fy - fz)]
}

fn hsl_to_srgb(h: f64, s: f64, l: f64) -> V3 {
    let h = h.rem_euclid(360.0);
    let f = |n: f64| {
        let k = (n + h / 30.0).rem_euclid(12.0);
        l - s * l.min(1.0 - l) * (k - 3.0).min(9.0 - k).clamp(-1.0, 1.0)
    };
    [f(0.0), f(8.0), f(4.0)]
}
fn srgb_to_hsl(rgb: V3) -> V3 {
    let [r, g, b] = rgb;
    let max = r.max(g).max(b);
    let min = r.min(g).min(b);
    let l = (min + max) / 2.0;
    let d = max - min;
    let (mut h, mut s) = (f64::NAN, 0.0);
    if d != 0.0 {
        s = if l == 0.0 || l == 1.0 {
            0.0
        } else {
            (max - l) / l.min(1.0 - l)
        };
        h = if max == r {
            (g - b) / d + if g < b { 6.0 } else { 0.0 }
        } else if max == g {
            (b - r) / d + 2.0
        } else {
            (r - g) / d + 4.0
        } * 60.0;
    }
    [h, s, l]
}

// ---- out of gamut ----------------------------------------------------------------------------------

fn linear_to_srgb(rgb: V3, alpha: f64) -> Srgb {
    Srgb {
        r: from_linear(rgb[0]),
        g: from_linear(rgb[1]),
        b: from_linear(rgb[2]),
        a: alpha,
    }
}

/// An OKLab colour in sRGB. Outside the gamut the components lie outside 0..1 and `to_rgba8` clips them
/// channel by channel, which is what Chromium paints (it does not apply the CSS Color 4 chroma reduction;
/// the site shows the clipped colour, and so does the window).
pub fn oklab_to_srgb(l: f64, a: f64, b: f64, alpha: f64) -> Srgb {
    linear_to_srgb(oklab_to_linear(l, a, b), alpha)
}

// ---- parsing ---------------------------------------------------------------------------------------

/// Splits `a b c / d` or `a, b, c, d` into its arguments and the optional alpha.
fn args(inner: &str) -> Result<(Vec<String>, Option<String>), String> {
    let (body, alpha) = match inner.split_once('/') {
        Some((b, a)) => (b, Some(a.trim().to_string())),
        None => (inner, None),
    };
    let parts: Vec<String> = body
        .split(|c: char| c == ',' || c.is_whitespace())
        .filter(|s| !s.is_empty())
        .map(str::to_string)
        .collect();
    if alpha.is_none() && parts.len() == 4 && inner.contains(',') {
        // Legacy syntax: rgba(r, g, b, a)
        let a = parts[3].clone();
        return Ok((parts[..3].to_vec(), Some(a)));
    }
    Ok((parts, alpha))
}

fn number(s: &str, percent_scale: f64) -> Result<f64, String> {
    if s == "none" {
        return Ok(0.0);
    }
    if let Some(p) = s.strip_suffix('%') {
        return p
            .parse::<f64>()
            .map(|v| v / 100.0 * percent_scale)
            .map_err(|_| format!("not a number: {s}"));
    }
    s.parse::<f64>().map_err(|_| format!("not a number: {s}"))
}

fn angle(s: &str) -> Result<f64, String> {
    for (unit, to_deg) in [
        ("deg", 1.0),
        ("grad", 0.9),
        ("rad", 180.0 / std::f64::consts::PI),
        ("turn", 360.0),
    ] {
        if let Some(v) = s.strip_suffix(unit) {
            return v
                .parse::<f64>()
                .map(|v| v * to_deg)
                .map_err(|_| format!("not an angle: {s}"));
        }
    }
    if s == "none" {
        return Ok(0.0);
    }
    s.parse::<f64>().map_err(|_| format!("not an angle: {s}"))
}

fn alpha_of(a: &Option<String>) -> Result<f64, String> {
    match a {
        None => Ok(1.0),
        Some(s) => Ok(number(s, 1.0)?.clamp(0.0, 1.0)),
    }
}

fn function(s: &str) -> Option<(String, &str)> {
    let open = s.find('(')?;
    let inner = s[open + 1..].strip_suffix(')')?;
    Some((s[..open].trim().to_ascii_lowercase(), inner))
}

fn hex(s: &str) -> Result<Srgb, String> {
    let digits = &s[1..];
    if !digits.chars().all(|c| c.is_ascii_hexdigit()) || ![3, 4, 6, 8].contains(&digits.len()) {
        return Err(format!("not a hex colour: {s}"));
    }
    let v = |i: usize, n: usize| -> f64 {
        let part = &digits[i..i + n];
        let x = u8::from_str_radix(part, 16).unwrap() as f64;
        (if n == 1 { x * 17.0 } else { x }) / 255.0
    };
    Ok(match digits.len() {
        3 => Srgb {
            r: v(0, 1),
            g: v(1, 1),
            b: v(2, 1),
            a: 1.0,
        },
        4 => Srgb {
            r: v(0, 1),
            g: v(1, 1),
            b: v(2, 1),
            a: v(3, 1),
        },
        6 => Srgb {
            r: v(0, 2),
            g: v(2, 2),
            b: v(4, 2),
            a: 1.0,
        },
        _ => Srgb {
            r: v(0, 2),
            g: v(2, 2),
            b: v(4, 2),
            a: v(6, 2),
        },
    })
}

/// A colour with, when it was written in a polar or Lab space, the components as written: a mix in that
/// same space uses them as they are (a hue stays even where the chroma is small), as Chromium does.
#[derive(Clone, Copy, Debug)]
struct Parsed {
    srgb: Srgb,
    native: Option<(Space, V3)>,
}

impl From<Srgb> for Parsed {
    fn from(srgb: Srgb) -> Self {
        Parsed { srgb, native: None }
    }
}

/// Parses one CSS `<color>`.
pub fn parse(input: &str) -> Result<Srgb, String> {
    parse_native(input).map(|p| p.srgb)
}

fn parse_native(input: &str) -> Result<Parsed, String> {
    let s = input.trim();
    if s.starts_with('#') {
        return hex(s).map(Parsed::from);
    }
    match s.to_ascii_lowercase().as_str() {
        "transparent" => {
            return Ok(Srgb {
                r: 0.0,
                g: 0.0,
                b: 0.0,
                a: 0.0,
            }
            .into());
        }
        "white" => {
            return Ok(Srgb {
                r: 1.0,
                g: 1.0,
                b: 1.0,
                a: 1.0,
            }
            .into());
        }
        "black" => {
            return Ok(Srgb {
                r: 0.0,
                g: 0.0,
                b: 0.0,
                a: 1.0,
            }
            .into());
        }
        _ => {}
    }
    let Some((name, inner)) = function(s) else {
        return Err(format!("not a colour I can convert exactly: {s}"));
    };
    if name == "color-mix" {
        return color_mix(inner);
    }
    let (a, alpha) = args(inner)?;
    let alpha = alpha_of(&alpha)?;
    let need = |n: usize| {
        if a.len() == n {
            Ok(())
        } else {
            Err(format!("{name}() takes {n} components: {s}"))
        }
    };
    let plain = |c: Srgb| -> Result<Parsed, String> { Ok(c.into()) };
    match name.as_str() {
        "rgb" | "rgba" => {
            need(3)?;
            let c = |i: usize| number(&a[i], 255.0).map(|v| v / 255.0);
            plain(Srgb {
                r: c(0)?,
                g: c(1)?,
                b: c(2)?,
                a: alpha,
            })
        }
        "hsl" | "hsla" => {
            need(3)?;
            let (h, sat, l) = (
                angle(&a[0])?,
                number(&a[1], 1.0)?.clamp(0.0, 1.0),
                number(&a[2], 1.0)?.clamp(0.0, 1.0),
            );
            let rgb = hsl_to_srgb(h, sat, l);
            Ok(Parsed {
                srgb: Srgb {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2],
                    a: alpha,
                },
                native: Some((Space::Hsl, [h.rem_euclid(360.0), sat, l])),
            })
        }
        "hwb" => {
            need(3)?;
            let (mut w, mut b) = (number(&a[1], 1.0)?, number(&a[2], 1.0)?);
            if w + b >= 1.0 {
                let gray = w / (w + b);
                return plain(Srgb {
                    r: gray,
                    g: gray,
                    b: gray,
                    a: alpha,
                });
            }
            let rgb = hsl_to_srgb(angle(&a[0])?, 1.0, 0.5);
            w = w.max(0.0);
            b = b.max(0.0);
            let f = |c: f64| c * (1.0 - w - b) + w;
            plain(Srgb {
                r: f(rgb[0]),
                g: f(rgb[1]),
                b: f(rgb[2]),
                a: alpha,
            })
        }
        "oklab" => {
            need(3)?;
            let v = [
                number(&a[0], 1.0)?,
                number(&a[1], 0.4)?,
                number(&a[2], 0.4)?,
            ];
            Ok(Parsed {
                srgb: oklab_to_srgb(v[0], v[1], v[2], alpha),
                native: Some((Space::Oklab, v)),
            })
        }
        "oklch" => {
            need(3)?;
            let (l, c, hue) = (
                number(&a[0], 1.0)?,
                number(&a[1], 0.4)?.max(0.0),
                angle(&a[2])?,
            );
            let h = hue.to_radians();
            Ok(Parsed {
                srgb: oklab_to_srgb(l, c * h.cos(), c * h.sin(), alpha),
                native: Some((Space::Oklch, [l, c, hue.rem_euclid(360.0)])),
            })
        }
        "lab" | "lch" => {
            need(3)?;
            let l = number(&a[0], 100.0)?.clamp(0.0, 100.0);
            let (la, lb, native) = if name == "lab" {
                let (x, y) = (number(&a[1], 125.0)?, number(&a[2], 125.0)?);
                (x, y, (Space::Lab, [l, x, y]))
            } else {
                let (c, hue) = (number(&a[1], 150.0)?.max(0.0), angle(&a[2])?);
                let h = hue.to_radians();
                (
                    c * h.cos(),
                    c * h.sin(),
                    (Space::Lch, [l, c, hue.rem_euclid(360.0)]),
                )
            };
            let ok = linear_to_oklab(lab_to_linear(l, la, lb));
            Ok(Parsed {
                srgb: oklab_to_srgb(ok[0], ok[1], ok[2], alpha),
                native: Some(native),
            })
        }
        "color" => {
            let (space, rest) = a.split_first().ok_or("empty color()")?;
            if space != "srgb" || rest.len() != 3 {
                return Err(format!("only color(srgb r g b) is supported: {s}"));
            }
            let c = |i: usize| number(&rest[i], 1.0);
            plain(Srgb {
                r: c(0)?,
                g: c(1)?,
                b: c(2)?,
                a: alpha,
            })
        }
        _ => Err(format!("not a colour I can convert exactly: {s}")),
    }
}

// ---- color-mix() -----------------------------------------------------------------------------------

#[derive(Clone, Copy, Debug, PartialEq)]
enum Space {
    Srgb,
    SrgbLinear,
    Oklab,
    Oklch,
    Lab,
    Lch,
    Hsl,
}

impl Space {
    fn hue_index(self) -> Option<usize> {
        match self {
            Space::Oklch | Space::Lch => Some(2),
            Space::Hsl => Some(0),
            _ => None,
        }
    }
    fn from(self, p: &Parsed) -> V3 {
        if let Some((space, v)) = p.native
            && space == self
        {
            return v;
        }
        let c = &p.srgb;
        let lin = [to_linear(c.r), to_linear(c.g), to_linear(c.b)];
        match self {
            Space::Srgb => [c.r, c.g, c.b],
            Space::SrgbLinear => lin,
            Space::Oklab => linear_to_oklab(lin),
            Space::Lab => linear_to_lab(lin),
            Space::Oklch | Space::Lch => {
                let lab = if self == Space::Oklch {
                    linear_to_oklab(lin)
                } else {
                    linear_to_lab(lin)
                };
                let chroma = (lab[1] * lab[1] + lab[2] * lab[2]).sqrt();
                // A colour converted from another space with almost no chroma has no hue: it is missing, and the
                // other colour's hue is used. Chromium's limits, measured: OKLCH 0.02, LCH about 0.15.
                let limit = if self == Space::Oklch { 0.02 } else { 0.15 };
                let hue = if chroma < limit {
                    f64::NAN
                } else {
                    lab[2].atan2(lab[1]).to_degrees().rem_euclid(360.0)
                };
                [lab[0], chroma, hue]
            }
            Space::Hsl => {
                let h = srgb_to_hsl([c.r, c.g, c.b]);
                [h[0], h[1], h[2]]
            }
        }
    }
    fn to(self, v: V3, alpha: f64) -> Srgb {
        match self {
            Space::Srgb => Srgb {
                r: v[0],
                g: v[1],
                b: v[2],
                a: alpha,
            },
            Space::SrgbLinear => linear_to_srgb(v, alpha),
            Space::Oklab => oklab_to_srgb(v[0], v[1], v[2], alpha),
            Space::Lab => {
                let ok = linear_to_oklab(lab_to_linear(v[0], v[1], v[2]));
                oklab_to_srgb(ok[0], ok[1], ok[2], alpha)
            }
            Space::Oklch => {
                let h = v[2].to_radians();
                oklab_to_srgb(v[0], v[1] * h.cos(), v[1] * h.sin(), alpha)
            }
            Space::Lch => {
                let h = v[2].to_radians();
                let ok = linear_to_oklab(lab_to_linear(v[0], v[1] * h.cos(), v[1] * h.sin()));
                oklab_to_srgb(ok[0], ok[1], ok[2], alpha)
            }
            Space::Hsl => {
                let rgb = hsl_to_srgb(v[0], v[1], v[2]);
                Srgb {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2],
                    a: alpha,
                }
            }
        }
    }
}

/// Splits on commas that are not inside parentheses.
fn split_top(s: &str, sep: char) -> Vec<String> {
    let (mut depth, mut out, mut cur) = (0i32, Vec::new(), String::new());
    for c in s.chars() {
        match c {
            '(' => depth += 1,
            ')' => depth -= 1,
            _ => {}
        }
        if c == sep && depth == 0 {
            out.push(std::mem::take(&mut cur));
        } else {
            cur.push(c);
        }
    }
    out.push(cur);
    out.into_iter().map(|p| p.trim().to_string()).collect()
}

/// A `colour [percentage]` item of color-mix().
fn mix_item(item: &str) -> Result<(Parsed, Option<f64>), String> {
    let item = item.trim();
    // The percentage may come before or after the colour.
    let words: Vec<&str> = item.rsplitn(2, char::is_whitespace).collect();
    if words.len() == 2
        && words[0].ends_with('%')
        && words[0].trim_end_matches('%').parse::<f64>().is_ok()
    {
        let p = words[0].trim_end_matches('%').parse::<f64>().unwrap();
        return Ok((parse_native(words[1])?, Some(p)));
    }
    if let Some((first, rest)) = item.split_once(char::is_whitespace)
        && first.ends_with('%')
        && let Ok(p) = first.trim_end_matches('%').parse::<f64>()
    {
        return Ok((parse_native(rest)?, Some(p)));
    }
    Ok((parse_native(item)?, None))
}

fn color_mix(inner: &str) -> Result<Parsed, String> {
    let parts = split_top(inner, ',');
    if parts.len() != 3 {
        return Err(format!(
            "color-mix() takes a space and two colours: color-mix({inner})"
        ));
    }
    let words: Vec<&str> = parts[0].split_whitespace().collect();
    if words.first() != Some(&"in") || words.len() < 2 {
        return Err(format!(
            "color-mix() must start with `in <space>`: color-mix({inner})"
        ));
    }
    let space = match words[1] {
        "srgb" => Space::Srgb,
        "srgb-linear" => Space::SrgbLinear,
        "oklab" => Space::Oklab,
        "oklch" => Space::Oklch,
        "lab" => Space::Lab,
        "lch" => Space::Lch,
        "hsl" => Space::Hsl,
        other => {
            return Err(format!(
                "color-mix() in {other} is not supported; use srgb, srgb-linear, oklab, oklch, lab, lch or hsl"
            ));
        }
    };
    let hue_method = match words.get(2..) {
        Some(["shorter", "hue"]) | Some([]) | None => "shorter",
        Some(["longer", "hue"]) => "longer",
        Some(["increasing", "hue"]) => "increasing",
        Some(["decreasing", "hue"]) => "decreasing",
        _ => return Err(format!("unknown hue interpolation in color-mix({inner})")),
    };
    let (c1, p1) = mix_item(&parts[1])?;
    let (c2, p2) = mix_item(&parts[2])?;
    let (p1, p2) = match (p1, p2) {
        (None, None) => (50.0, 50.0),
        (Some(a), None) => (a, 100.0 - a),
        (None, Some(b)) => (100.0 - b, b),
        (Some(a), Some(b)) => (a, b),
    };
    let sum = p1 + p2;
    if p1 < 0.0 || p2 < 0.0 || sum <= 0.0 {
        return Err(format!(
            "color-mix() percentages must be positive: color-mix({inner})"
        ));
    }
    let (w1, w2) = (p1 / sum, p2 / sum);
    let alpha_mult = (sum / 100.0).min(1.0);
    let (mut v1, mut v2) = (space.from(&c1), space.from(&c2));
    let hue = space.hue_index();
    // Missing hue (achromatic): take the other colour's.
    if let Some(h) = hue {
        if v1[h].is_nan() && !v2[h].is_nan() {
            v1[h] = v2[h];
        } else if v2[h].is_nan() && !v1[h].is_nan() {
            v2[h] = v1[h];
        } else if v1[h].is_nan() {
            v1[h] = 0.0;
            v2[h] = 0.0;
        }
        let (mut a, mut b) = (v1[h].rem_euclid(360.0), v2[h].rem_euclid(360.0));
        let d = b - a;
        match hue_method {
            "shorter" => {
                if d > 180.0 {
                    a += 360.0
                } else if d < -180.0 {
                    b += 360.0
                }
            }
            "longer" => {
                if d > 0.0 && d < 180.0 {
                    a += 360.0
                } else if d > -180.0 && d <= 0.0 {
                    b += 360.0
                }
            }
            "increasing" => {
                if b < a {
                    b += 360.0
                }
            }
            _ => {
                if a < b {
                    a += 360.0
                }
            }
        }
        v1[h] = a;
        v2[h] = b;
    }
    let (a1, a2) = (c1.srgb.a, c2.srgb.a);
    let alpha = a1 * w1 + a2 * w2;
    let mut out = [0.0; 3];
    for i in 0..3 {
        out[i] = if Some(i) == hue {
            (v1[i] * w1 + v2[i] * w2).rem_euclid(360.0)
        } else if alpha == 0.0 {
            v1[i] * w1 + v2[i] * w2
        } else {
            // Premultiplied interpolation, as CSS says.
            (v1[i] * a1 * w1 + v2[i] * a2 * w2) / alpha
        };
    }
    let alpha = alpha * alpha_mult;
    Ok(Parsed {
        srgb: space.to(out, alpha),
        native: Some((space, out)),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn px(s: &str) -> String {
        parse(s).unwrap().to_rgba8().to_slint()
    }

    #[test]
    fn hex_and_rgb_are_exact() {
        assert_eq!(px("#91dfbd"), "#91dfbd");
        assert_eq!(px("#abc"), "#aabbcc");
        assert_eq!(px("#fff"), "#ffffff");
        assert_eq!(px("rgb(181, 218, 206)"), "#b5dace");
        assert_eq!(px("rgb(181 218 206)"), "#b5dace");
        assert_eq!(px("rgba(181, 218, 206, 0.1)"), "#b5dace1a");
        assert_eq!(px("rgb(181 218 206 / 10%)"), "#b5dace1a");
        assert_eq!(px("rgb(100% 0% 0%)"), "#ff0000");
        assert_eq!(px("#11223344"), "#11223344");
        assert_eq!(px("transparent"), "#00000000");
    }

    #[test]
    fn alpha_rounds_like_browsers() {
        // Chromium (headless, canvas): 0.5 -> 128, 0.85 -> 217, 0.1 -> 26, 0.4 -> 102.
        assert_eq!(px("rgba(0, 0, 0, 0.5)"), "#00000080");
        assert_eq!(px("rgba(0, 0, 0, 0.85)"), "#000000d9");
        assert_eq!(px("rgba(0, 0, 0, 0)"), "#00000000");
        assert_eq!(px("rgba(0, 0, 0, 0.4)"), "#00000066");
    }

    /// Every value below was painted by Chromium 148 (Playwright 1.65.1, headless, canvas, sRGB) on 26/11/2026:
    /// finestra-unica-prove/colori/chromium-colori.mjs. The conversion must give the same 8 bits.
    #[test]
    fn same_pixels_as_chromium() {
        for (css, expected) in [
            ("oklch(0.7 0.1 150)", "#6fb07d"),
            ("oklch(0.5 0.1 250)", "#32669a"),
            ("oklab(0.7 -0.05 0.05)", "#8ca97c"),
            ("oklch(1 0 0)", "#ffffff"),
            ("oklch(0 0 0)", "#000000"),
            ("oklch(62.8% 0.2577 29.23)", "#ff0000"),
            // outside the sRGB gamut: Chromium clips each channel
            ("oklch(0.7 0.4 150)", "#00d600"),
            ("oklch(0.9 0.3 20)", "#ff6987"),
            ("oklch(0.6 0.3 300)", "#a226ff"),
            ("oklch(0.3 0.2 30)", "#740000"),
            ("color-mix(in srgb, #ff0000 50%, #0000ff)", "#800080"),
            ("color-mix(in oklab, #ff0000, #0000ff)", "#8c53a2"),
            ("color-mix(in oklch, #ff0000 30%, #0000ff)", "#8800ec"),
            ("color-mix(in srgb, #91dfbd 40%, #1b2223)", "#4a6e61"),
            ("color-mix(in oklch, #91dfbd 60%, #1b2223)", "#5f8d79"),
            ("color-mix(in srgb-linear, #91dfbd, #1b2223)", "#6ba58c"),
            ("color-mix(in hsl, #91dfbd, #1b2223)", "#479085"),
            ("color-mix(in oklch, #91dfbd, #1b2223 70%)", "#3d554a"),
            ("color-mix(in lab, #ff0000, #0000ff)", "#c10088"),
            ("color-mix(in lch, #ff0000 30%, #0000ff)", "#cb00bb"),
            ("lab(50 40 59.5)", "#bf5700"),
            ("lch(50 72 56)", "#bf5700"),
            ("lab(80 -60 70)", "#5de128"),
            ("lch(30 100 280)", "#0047e8"),
            ("hsl(120 100% 25%)", "#008000"),
            ("hwb(0 50% 50%)", "#808080"),
            ("hwb(200 20% 10%)", "#33aae6"),
            ("color(srgb 0.5 0.25 0.75)", "#8040bf"),
        ] {
            assert_eq!(px(css), expected, "{css}");
        }
    }

    #[test]
    fn color_mix_with_alpha_keeps_straight_colour_and_alpha() {
        // Chromium: color-mix(in srgb, #fff 25%, transparent) is white at 64/255; the mix is premultiplied.
        assert_eq!(px("color-mix(in srgb, #fff 25%, transparent)"), "#ffffff40");
        // color-mix(in oklab, #91dfbd 60%, #1b2223 20%): Chromium computes oklab(0.69398 -0.0683353 0.0164621 / 0.8)
        assert_eq!(
            px("color-mix(in oklab, #91dfbd 60%, #1b2223 20%)"),
            px("oklab(0.69398 -0.0683353 0.0164621 / 0.8)")
        );
        assert!(px("color-mix(in oklab, #91dfbd 60%, #1b2223 20%)").ends_with("cc"));
        // color-mix(in oklab, oklch(0.7 0.1 150 / 0.5) 50%, #123456): oklab(0.446108 -0.0444506 -0.0290461 / 0.75)
        assert_eq!(
            px("color-mix(in oklab, oklch(0.7 0.1 150 / 0.5) 50%, #123456)"),
            px("oklab(0.446108 -0.0444506 -0.0290461 / 0.75)")
        );
        assert_eq!(px("oklch(0.7 0.1 150 / 0.4)"), "#6fb07d66");
    }

    /// Chromium keeps the hue written in an oklch() colour, and treats the hue of a colour converted from sRGB as
    /// missing under 0.02 of chroma (finestra-unica-prove/colori/chromium-hue*.mjs).
    #[test]
    fn mix_hue_follows_chromium() {
        let same = |a: &str, b: &str| assert_eq!(px(a), px(b), "{a} / {b}");
        same(
            "color-mix(in oklch, oklch(0.5 0.01 200) 50%, oklch(0.8 0.1 100))",
            "oklch(0.65 0.055 150)",
        );
        same(
            "color-mix(in oklch, oklab(0.5 -0.009 -0.004) 50%, oklch(0.8 0.1 100))",
            "oklch(0.65 0.0549244 100)",
        );
        same(
            "color-mix(in oklch, color-mix(in oklch, oklch(0.5 0.01 200), oklch(0.5 0.01 220)) 50%, oklch(0.8 0.1 100))",
            "oklch(0.65 0.055 155)",
        );
        same(
            "color-mix(in oklch, oklch(0.5 0.1 350) 50%, oklch(0.5 0.1 10))",
            "oklch(0.5 0.1 0)",
        );
        same(
            "color-mix(in oklch, #91dfbd 50%, #808080)",
            "oklch(0.72168 0.0455867 165.052)",
        );
    }

    #[test]
    fn what_cannot_be_exact_is_refused() {
        for bad in [
            "#12",
            "#gggggg",
            "rgb(1 2)",
            "currentcolor",
            "papayawhip",
            "color-mix(in display-p3, red, blue)",
            "color(display-p3 1 0 0)",
            "light-dark(#fff, #000)",
        ] {
            assert!(parse(bad).is_err(), "{bad}");
        }
    }
}
