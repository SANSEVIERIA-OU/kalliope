# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Exercise the linked binaries with a desktop session: a Windows or macOS runner, or Linux under Xvfb.

On Linux the window is found with xdotool and photographed with ImageMagick; a picture named desktop-window-dark.png or
desktop-window-light.png must be dark or light on the whole (the system appearance reached the window). Run it under
`xvfb-run -a -s "-screen 0 1280x900x24" dbus-run-session -- python3 -I tools/portale_finto.py dark -- python3 tools/check_desktop.py desktop-window-dark.png`
(a true-colour screen: the default 8-bit one of xvfb-run is too poor for the window).
KALLIOPE_BIN_DIR names the folder with the binaries (default target/debug)."""
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


def windows_outside_work_area(handle):
    """How many pixels of the window lie outside the work area of the primary monitor (the screen less the taskbar)."""
    from ctypes import wintypes
    user32 = ctypes.windll.user32
    work, window = wintypes.RECT(), wintypes.RECT()
    user32.SystemParametersInfoW(0x0030, 0, ctypes.byref(work), 0)  # SPI_GETWORKAREA
    user32.GetWindowRect(handle, ctypes.byref(window))
    return outside((window.left, window.top, window.right, window.bottom), (work.left, work.top, work.right, work.bottom))


def outside(window, area):
    """The largest overhang of the rectangle `window` beyond `area`, both (left, top, right, bottom); 0 when inside."""
    return max(0, area[0] - window[0], area[1] - window[1], window[2] - area[2], window[3] - area[3])


def ends_when_destroyed(window, handle):
    """Destroys the window from outside, as a crashed compositor or `xdotool windowclose` does, and requires Kalliope to
    end with it, taking its microphone (issue #24)."""
    subprocess.run(["xdotool", "windowclose", handle], check=True)
    try:
        window.wait(timeout=10)
    except subprocess.TimeoutExpired:
        raise RuntimeError("Kalliope kept running after its window was destroyed") from None
    print(f"The window destroyed from outside ended Kalliope (exit {window.returncode})", flush=True)


def mac_inspector(work):
    helper = Path(work) / "macos-window"
    source = Path(__file__).with_name("macos_window.swift")
    subprocess.run(["xcrun", "swiftc", str(source), "-o", helper], check=True, timeout=90)

    def visible_windows(pid):
        output = subprocess.check_output([helper, str(pid)], timeout=5)
        return json.loads(output)

    return visible_windows, helper


def linux_window(pid):
    """(window id, width, height) of the visible windows titled Kalliope that the process owns."""
    found = subprocess.run(["xdotool", "search", "--onlyvisible", "--pid", str(pid), "--name", "^Kalliope$"], capture_output=True, text=True)
    windows = []
    for handle in found.stdout.split():
        geometry = subprocess.run(["xdotool", "getwindowgeometry", "--shell", handle], capture_output=True, text=True).stdout
        size = dict(line.split("=") for line in geometry.split() if "=" in line)
        windows.append((handle, int(size.get("WIDTH", 0)), int(size.get("HEIGHT", 0))))
    return windows


def mean_brightness(path):
    """0 (black) to 1 (white): the mean of the picture, by ImageMagick."""
    out = subprocess.check_output(["convert", str(path), "-colorspace", "Gray", "-format", "%[fx:mean]", "info:"], text=True)
    return float(out)


def check_appearance(path):
    """A picture named for an appearance must be of that appearance: the window follows the system."""
    wanted = {"desktop-window-dark.png": "dark", "desktop-window-light.png": "light"}.get(Path(path).name)
    if wanted is None:
        return
    brightness = mean_brightness(path)
    if (wanted == "dark" and brightness > 0.35) or (wanted == "light" and brightness < 0.65):
        raise RuntimeError(f"{path} should be {wanted} but its mean brightness is {brightness:.2f}")
    print(f"{path} is {wanted} (mean brightness {brightness:.2f})", flush=True)


def take_window_picture(handle, path):
    if sys.platform.startswith("linux"):
        subprocess.run(["import", "-window", str(handle), str(path)], check=True, timeout=30)
        return
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
                    [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr h, int attr, out Rect rect, int size);
                    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
                }'
            $box = New-Object WindowBounds+Rect
            $handle = [IntPtr]::new([long]$env:KALLIOPE_TEST_HWND)
            [void][WindowBounds]::SetForegroundWindow($handle)
            if ([WindowBounds]::DwmGetWindowAttribute($handle, 9, [ref]$box, 16) -ne 0) {
                [void][WindowBounds]::GetWindowRect($handle, [ref]$box)
            }
            $bitmap = [Drawing.Bitmap]::new($box.r-$box.x,$box.b-$box.y)
            $g = [Drawing.Graphics]::FromImage($bitmap)
            $g.CopyFromScreen($box.x,$box.y,0,0,$bitmap.Size)
            $bitmap.Save($env:KALLIOPE_TEST_PNG, [Drawing.Imaging.ImageFormat]::Png)
            $g.Dispose()
            $bitmap.Dispose()
        """]
    subprocess.run(cmd, check=True, timeout=30, env={**os.environ, "KALLIOPE_TEST_HWND":str(handle), "KALLIOPE_TEST_PNG":str(path)})


def main():
    output = Path(sys.argv[1] if len(sys.argv) == 2 else "desktop-window.png").resolve()
    binary_dir = Path(os.environ.get("KALLIOPE_BIN_DIR", "target/debug")).resolve()
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
        if sys.platform.startswith("linux"):
            inspect, helper = linux_window, None
        elif sys.platform == "win32":
            inspect, helper = windows_window, None
        else:
            inspect, helper = mac_inspector(work)
        with subprocess.Popen([app]) as window:
            try:
                deadline = time.monotonic() + 40
                while time.monotonic() < deadline:
                    if window.poll() is not None:
                        raise RuntimeError(f"Window exited with {window.returncode}")
                    for handle, width, height in inspect(window.pid):
                        if width >= 260 and height >= 180:
                            print(f"Visible {sys.platform} window, {width} × {height}", flush=True)
                            time.sleep(2)
                            take_window_picture(handle, output)
                            if helper and output.name == "desktop-window-dark.png":
                                subprocess.run([helper, "--check-dark", output], check=True, timeout=10)
                            if sys.platform == "win32" and (over := windows_outside_work_area(handle)):
                                raise RuntimeError(f"The window runs {over} px outside the work area (issue #23)")
                            if sys.platform.startswith("linux"):
                                check_appearance(output)
                                ends_when_destroyed(window, handle)
                            return
                    time.sleep(0.5)
                raise RuntimeError("The operating system did not report a visible application window")
            finally:
                if window.poll() is None:
                    window.terminate()


if __name__ == "__main__":
    main()
