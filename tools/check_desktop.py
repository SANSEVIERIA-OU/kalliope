# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Exercise the linked binaries on a Windows or macOS runner with a desktop session."""
import ctypes
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import wave

from version import current


def windows_window(pid):
    from ctypes import wintypes
    user32 = ctypes.windll.user32
    windows = []
    callback = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)

    @callback
    def inspect(handle, _):
        owner = wintypes.DWORD()
        user32.GetWindowThreadProcessId(handle, ctypes.byref(owner))
        if owner.value == pid and user32.IsWindowVisible(handle):
            title = ctypes.create_unicode_buffer(256)
            user32.GetWindowTextW(handle, title, len(title))
            if title.value == "Kalliope":
                rect = wintypes.RECT()
                user32.GetClientRect(handle, ctypes.byref(rect))
                windows.append((handle, rect.right, rect.bottom))
        return True

    user32.EnumWindows(inspect, 0)
    return windows


def mac_windows(pid):
    # Window titles can require screen-recording permission. The owning PID, layer
    # and bounds identify our visible window without inspecting another app.
    result = subprocess.check_output(["osascript", "-l", "JavaScript", "-e", """
        ObjC.import("CoreGraphics");
        function run(argv) {
            const all = ObjC.deepUnwrap($.CGWindowListCopyWindowInfo(17, 0));
            return JSON.stringify(all.filter(w => w.kCGWindowOwnerPID === Number(argv[0])
                && w.kCGWindowLayer === 0).map(w => [w.kCGWindowNumber, w.kCGWindowBounds.Width, w.kCGWindowBounds.Height]));
        }
    """, str(pid)], text=True)
    return json.loads(result)


def take_window_picture(handle, path):
    if sys.platform == "darwin":
        cmd = ["screencapture", "-x", "-o", "-l", str(handle), str(path)]
    else:
        # Use the visible window bounds supplied by Windows, including its frame.
        cmd = ["powershell", "-NoProfile", "-Command", r"""
            $ErrorActionPreference = 'Stop'
            Add-Type -AssemblyName System.Drawing
            Add-Type 'using System; using System.Runtime.InteropServices;
                public class WindowBounds {
                    [StructLayout(LayoutKind.Sequential)] public struct Rect { public int x,y,r,b; }
                    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out Rect rect);
                    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
                }'
            $box = New-Object WindowBounds+Rect
            $handle = [IntPtr]::new([long]$env:KALLIOPE_TEST_HWND)
            [void][WindowBounds]::SetForegroundWindow($handle)
            [void][WindowBounds]::GetWindowRect($handle, [ref]$box)
            $bitmap = [Drawing.Bitmap]::new($box.r-$box.x,$box.b-$box.y)
            $g = [Drawing.Graphics]::FromImage($bitmap)
            $g.CopyFromScreen($box.x,$box.y,0,0,$bitmap.Size)
            $bitmap.Save($env:KALLIOPE_TEST_PNG, [Drawing.Imaging.ImageFormat]::Png)
            $g.Dispose()
            $bitmap.Dispose()
        """]
    subprocess.run(cmd, check=True, timeout=30, env={**os.environ, "KALLIOPE_TEST_HWND":str(handle), "KALLIOPE_TEST_PNG":str(path)})


def main():
    binary_dir = Path("target/debug").resolve()
    suffix = ".exe" if sys.platform == "win32" else ""
    app = binary_dir / ("kalliope" + suffix)
    cli = binary_dir / ("kalliope-cli" + suffix)
    expected = "kalliope " + current()
    actual = subprocess.check_output([app, "--version"], text=True).strip()
    if actual != expected:
        raise RuntimeError(f"{actual!r}, expected {expected!r}")
    with tempfile.TemporaryDirectory() as work:
        wav = Path(work) / "said.wav"
        subprocess.run([cli, "say", "-o", wav, "Buongiorno a tutti, scusate il ritardo."], check=True)
        with wave.open(str(wav)) as sound:
            duration = sound.getnframes() / sound.getframerate()
            if not 1.5 < duration < 6 or not any(sound.readframes(sound.getnframes())):
                raise RuntimeError("The recording has an unexpected duration or is silent")
        print(f"{actual}, generated {duration:.2f} s of speech", flush=True)
        with subprocess.Popen([app], env={**os.environ, "XDG_CONFIG_HOME": work}) as window:
            try:
                inspect = windows_window if sys.platform == "win32" else mac_windows
                deadline = time.monotonic() + 40
                while time.monotonic() < deadline:
                    if window.poll() is not None:
                        raise RuntimeError(f"Window exited with {window.returncode}")
                    for handle, width, height in inspect(window.pid):
                        if width >= 260 and height >= 180:
                            print(f"Visible {sys.platform} window, {width} × {height}", flush=True)
                            time.sleep(2)
                            take_window_picture(handle, Path("desktop-window.png").resolve())
                            return
                    time.sleep(0.5)
                raise RuntimeError("The operating system did not report a visible application window")
            finally:
                if window.poll() is None:
                    window.terminate()


if __name__ == "__main__":
    main()
