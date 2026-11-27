// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The screen: the size and place the window opens at, and the end of Kalliope when its window is gone.
//!
//! - The window opens at a size that fits the work area of the monitor it opens on (the monitor less its panels and
//!   taskbar, frame included): the design's size, or smaller in the same proportions, never below the smallest window.
//! - The place of the last time comes back only on a monitor still connected, moved in so that the whole window is
//!   visible; otherwise the system places the window (on Windows it is centred in the work area, because the system's
//!   default place can put its foot under the taskbar). Under Wayland the compositor places every window and a program
//!   neither learns nor sets its position: nothing is remembered or asked there, and the size fits the smallest output.
//! - Kalliope ends whenever its window is gone: closed, or destroyed from outside (winit's `Destroyed`, which Slint does
//!   not act on). The microphone goes with it.
//!
//! winit gives the monitors when the event loop starts, before Slint creates the window (`slint::winit_030`, a custom
//! application handler); the geometry itself is pure and tested, in physical pixels of the desktop.

use crate::AppWindow;
use slint::ComponentHandle;
use slint::winit_030::winit::event::WindowEvent;
use slint::winit_030::winit::event_loop::ActiveEventLoop;
use slint::winit_030::winit::monitor::MonitorHandle;
use slint::winit_030::winit::window::{Window, WindowId};
use slint::winit_030::{CustomApplicationHandler, EventResult};
use std::cell::{Cell, RefCell};

/// A rectangle of the desktop, in physical pixels.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Rect {
    pub x: i32,
    pub y: i32,
    pub w: u32,
    pub h: u32,
}

impl Rect {
    fn right(&self) -> i64 {
        self.x as i64 + self.w as i64
    }

    fn bottom(&self) -> i64 {
        self.y as i64 + self.h as i64
    }

    /// The part of `self` inside `other`, if they overlap.
    pub fn intersect(&self, other: &Rect) -> Option<Rect> {
        let (x, y) = (self.x.max(other.x), self.y.max(other.y));
        let (right, bottom) = (
            self.right().min(other.right()),
            self.bottom().min(other.bottom()),
        );
        (right > x as i64 && bottom > y as i64).then(|| Rect {
            x,
            y,
            w: (right - x as i64) as u32,
            h: (bottom - y as i64) as u32,
        })
    }

    fn area(&self) -> u64 {
        self.w as u64 * self.h as u64
    }
}

/// A connected monitor: its work area (without panels and taskbar, where the system says so) and its scale.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Monitor {
    pub area: Rect,
    pub scale: f64,
}

/// The window's measures from the design, in logical pixels: the size it asks for, the smallest it can be, and what
/// the system's frame adds around it (unknown until the window is open).
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Measures {
    pub size: (f32, f32),
    pub min: (f32, f32),
    pub frame: (f32, f32),
}

/// How the window opens: its size in logical pixels, and the top left corner of its frame, when it is Kalliope that
/// places it.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Opening {
    pub size: (f32, f32),
    pub position: Option<(i32, i32)>,
}

/// The size of the window on `monitor`: `m.size`, or smaller in the same proportions so that it and its frame fit the
/// work area; never smaller than `m.min`, which wins on a screen too small for it.
pub fn fit(m: &Measures, monitor: &Monitor) -> (f32, f32) {
    let scale = if monitor.scale.is_finite() && monitor.scale > 0.0 {
        monitor.scale as f32
    } else {
        1.0
    };
    let room = (
        monitor.area.w as f32 / scale - m.frame.0,
        monitor.area.h as f32 / scale - m.frame.1,
    );
    let k = (room.0 / m.size.0).min(room.1 / m.size.1).min(1.0);
    let k = if k.is_finite() { k.max(0.0) } else { 1.0 };
    (
        (m.size.0 * k).floor().max(m.min.0),
        (m.size.1 * k).floor().max(m.min.1),
    )
}

/// The window of logical `size`, frame included, in physical pixels on `monitor`.
fn outer(m: &Measures, monitor: &Monitor, size: (f32, f32)) -> (u32, u32) {
    let scale = monitor.scale.max(0.1);
    (
        ((size.0 + m.frame.0) as f64 * scale).round() as u32,
        ((size.1 + m.frame.1) as f64 * scale).round() as u32,
    )
}

/// `at` moved as little as possible so that a window of `outer` pixels lies inside `area`; a window larger than the
/// area keeps its top left corner in it (the title bar stays reachable).
pub fn inside(at: (i32, i32), outer: (u32, u32), area: &Rect) -> (i32, i32) {
    let axis = |at: i32, len: u32, start: i32, room: u32| -> i32 {
        let last = start as i64 + room as i64 - len as i64;
        if last < start as i64 {
            start
        } else {
            (at as i64).clamp(start as i64, last) as i32
        }
    };
    (
        axis(at.0, outer.0, area.x, area.w),
        axis(at.1, outer.1, area.y, area.h),
    )
}

/// How the window opens on these `monitors`: on the one where the window of the last time (`saved`) overlaps most,
/// moved in to be all visible; when it overlaps none (that monitor is gone), or nothing was saved, where the system
/// places it, sized for the `primary` monitor, or for the smallest when there is no primary (Wayland). `centre` puts
/// it in the middle of that monitor's work area instead of leaving the place to the system.
pub fn opening(
    m: &Measures,
    monitors: &[Monitor],
    primary: Option<usize>,
    saved: Option<(i32, i32)>,
    centre: bool,
) -> Opening {
    let remembered = saved.and_then(|at| {
        monitors
            .iter()
            .filter_map(|monitor| {
                let (w, h) = outer(m, monitor, fit(m, monitor));
                let window = Rect {
                    x: at.0,
                    y: at.1,
                    w,
                    h,
                };
                window
                    .intersect(&monitor.area)
                    .map(|seen| (seen.area(), monitor))
            })
            .max_by_key(|(seen, _)| *seen)
            .map(|(_, monitor)| (at, monitor))
    });
    if let Some((at, monitor)) = remembered {
        let size = fit(m, monitor);
        return Opening {
            size,
            position: Some(inside(at, outer(m, monitor, size), &monitor.area)),
        };
    }
    let target = primary.and_then(|i| monitors.get(i)).or_else(|| {
        monitors.iter().min_by(|a, b| {
            let (fa, fb) = (fit(m, a), fit(m, b));
            (fa.0 * fa.1).total_cmp(&(fb.0 * fb.1))
        })
    });
    let Some(monitor) = target else {
        return Opening {
            size: m.size,
            position: None,
        };
    };
    let size = fit(m, monitor);
    let position = centre.then(|| {
        let (w, h) = outer(m, monitor, size);
        let area = &monitor.area;
        let at = (
            (area.x as i64 + (area.w as i64 - w as i64) / 2) as i32,
            (area.y as i64 + (area.h as i64 - h as i64) / 2) as i32,
        );
        inside(at, (w, h), area)
    });
    Opening { size, position }
}

/// The work area of `monitor` under X11: the part of `_NET_WORKAREA` (the desktop less its panels) on it, as GTK does;
/// the whole monitor when the window manager says nothing or the two do not meet.
#[cfg(any(target_os = "linux", test))]
pub fn work_area(monitor: Rect, net_workarea: Option<Rect>) -> Rect {
    net_workarea
        .and_then(|w| w.intersect(&monitor))
        .unwrap_or(monitor)
}

/// `_NET_WORKAREA` of the current desktop, read from the X server named by `DISPLAY` (the one winit uses).
#[cfg(target_os = "linux")]
fn x11_workarea() -> Option<Rect> {
    use x11rb::connection::Connection;
    use x11rb::protocol::xproto::{AtomEnum, ConnectionExt};
    let (conn, screen) = x11rb::xcb_ffi::XCBConnection::connect(None).ok()?;
    let root = conn.setup().roots.get(screen)?.root;
    let atom = |name: &[u8]| {
        conn.intern_atom(true, name)
            .ok()?
            .reply()
            .ok()
            .map(|r| r.atom)
            .filter(|&a| a != 0)
    };
    let cardinals = |property: u32| -> Option<Vec<u32>> {
        let reply = conn
            .get_property(false, root, property, AtomEnum::CARDINAL, 0, 1024)
            .ok()?
            .reply()
            .ok()?;
        Some(reply.value32()?.collect())
    };
    let desktop = atom(b"_NET_CURRENT_DESKTOP")
        .and_then(cardinals)
        .and_then(|v| v.first().copied())
        .unwrap_or(0) as usize;
    let areas = cardinals(atom(b"_NET_WORKAREA")?)?;
    let (each, _) = areas.as_chunks::<4>();
    let v = each.get(desktop).or_else(|| each.first())?;
    Some(Rect {
        x: v[0] as i32,
        y: v[1] as i32,
        w: v[2],
        h: v[3],
    })
}

/// The work area of a monitor under Windows (`rcWork`: the monitor less the taskbar and the docked bars).
#[cfg(target_os = "windows")]
fn windows_work_area(monitor: &MonitorHandle) -> Option<Rect> {
    use slint::winit_030::winit::platform::windows::MonitorHandleExtWindows;
    #[repr(C)]
    #[derive(Default)]
    struct WinRect {
        left: i32,
        top: i32,
        right: i32,
        bottom: i32,
    }
    #[repr(C)]
    #[derive(Default)]
    struct MonitorInfo {
        size: u32,
        monitor: WinRect,
        work: WinRect,
        flags: u32,
    }
    #[link(name = "user32")]
    unsafe extern "system" {
        fn GetMonitorInfoW(monitor: isize, info: *mut MonitorInfo) -> i32;
    }
    let mut info = MonitorInfo {
        size: std::mem::size_of::<MonitorInfo>() as u32,
        ..Default::default()
    };
    // SAFETY: a monitor handle the system gave winit, and a MONITORINFO whose size field is set, as the call requires.
    if unsafe { GetMonitorInfoW(monitor.hmonitor(), &mut info) } == 0 {
        return None;
    }
    let w = &info.work;
    Some(Rect {
        x: w.left,
        y: w.top,
        w: (w.right - w.left).max(0) as u32,
        h: (w.bottom - w.top).max(0) as u32,
    })
}

/// Whether the event loop runs under Wayland, where a program cannot know or choose its window's position.
fn wayland(event_loop: &ActiveEventLoop) -> bool {
    #[cfg(target_os = "linux")]
    {
        use slint::winit_030::winit::platform::wayland::ActiveEventLoopExtWayland;
        event_loop.is_wayland()
    }
    #[cfg(not(target_os = "linux"))]
    {
        let _ = event_loop;
        false
    }
}

/// The connected monitors, with their work areas, and which one is the primary.
fn monitors(event_loop: &ActiveEventLoop) -> (Vec<Monitor>, Option<usize>) {
    #[cfg(target_os = "linux")]
    let net = if wayland(event_loop) {
        None
    } else {
        x11_workarea()
    };
    let rect = |m: &MonitorHandle| {
        let (p, s) = (m.position(), m.size());
        Rect {
            x: p.x,
            y: p.y,
            w: s.width,
            h: s.height,
        }
    };
    let handles: Vec<MonitorHandle> = event_loop
        .available_monitors()
        .filter(|m| m.size().width > 1 && m.size().height > 1)
        .collect();
    let list = handles
        .iter()
        .map(|m| {
            let whole = rect(m);
            #[cfg(target_os = "linux")]
            let area = work_area(whole, net);
            #[cfg(target_os = "windows")]
            let area = windows_work_area(m).unwrap_or(whole);
            #[cfg(not(any(target_os = "linux", target_os = "windows")))]
            let area = whole;
            Monitor {
                area,
                scale: m.scale_factor(),
            }
        })
        .collect();
    let primary = event_loop
        .primary_monitor()
        .and_then(|p| handles.iter().position(|m| *m == p));
    (list, primary)
}

thread_local! {
    /// The window to watch, and to size and place when the event loop starts.
    static WINDOW: RefCell<Option<slint::Weak<AppWindow>>> = const { RefCell::new(None) };
    /// Where the window was last seen (its frame's top left corner), to remember it when Kalliope ends.
    static SEEN: Cell<Option<(i32, i32)>> = const { Cell::new(None) };
    /// The window was destroyed from outside: it cannot be asked anything any more.
    static GONE: Cell<bool> = const { Cell::new(false) };
    /// Under Wayland nothing is placed or remembered.
    static WAYLAND: Cell<bool> = const { Cell::new(false) };
}

/// Watches the window from winit's event loop: sizes and places it before it is created, notes where it moves, and
/// ends the event loop when it is destroyed without being closed.
pub struct Sentinella {
    opened: bool,
}

/// Installs the winit backend with the [`Sentinella`]: before the window is made.
pub fn installa() -> Result<(), slint::PlatformError> {
    slint::BackendSelector::new()
        .with_winit_custom_application_handler(Sentinella { opened: false })
        .select()
}

/// The window the [`Sentinella`] looks after; its saved place comes from the settings.
pub fn sorveglia(ui: &AppWindow) {
    WINDOW.with(|w| *w.borrow_mut() = Some(ui.as_weak()));
}

fn window() -> Option<AppWindow> {
    WINDOW.with(|w| w.borrow().as_ref().and_then(|w| w.upgrade()))
}

/// Notes where the window is now: called when it is asked to close, while it is still on the screen.
pub fn annota(ui: &AppWindow) {
    if !WAYLAND.get() && !GONE.get() {
        let p = ui.window().position();
        SEEN.set(Some((p.x, p.y)));
    }
}

/// Remembers where the window was, when Kalliope ends (nothing under Wayland, or when it was never seen).
pub fn ricorda() {
    if let Some(p) = SEEN.get() {
        crate::settings::save_position(p);
    }
}

fn measures(ui: &AppWindow, size: (f32, f32)) -> Measures {
    Measures {
        size,
        min: (ui.get_minima_larghezza(), ui.get_minima_altezza()),
        frame: (ui.get_cornice_larghezza(), ui.get_cornice_altezza()),
    }
}

impl Sentinella {
    /// The size and place the window opens at, from the monitors connected now. In the meeting mode the window opens
    /// at the meeting size, fitted the same way, and the size it gives back is the one fitted here.
    fn open(&mut self, event_loop: &ActiveEventLoop) {
        let Some(ui) = window() else { return };
        self.opened = true;
        let is_wayland = wayland(event_loop);
        WAYLAND.set(is_wayland);
        let (list, primary) = monitors(event_loop);
        let saved = if is_wayland {
            None
        } else {
            crate::settings::Settings::load().position
        };
        let centre = cfg!(target_os = "windows");
        let own = opening(
            &measures(&ui, (ui.get_nativa_larghezza(), ui.get_nativa_altezza())),
            &list,
            primary,
            saved,
            centre,
        );
        let meeting = crate::vista::compatta_misura(&ui);
        let chosen = if ui.get_compatta() {
            opening(&measures(&ui, meeting), &list, primary, saved, centre)
        } else {
            own
        };
        crate::vista::apertura(&ui, own.size, chosen.size);
        if let Some((x, y)) = chosen.position
            && !is_wayland
        {
            ui.window().set_position(slint::PhysicalPosition::new(x, y));
        }
        if std::env::var_os("KALLIOPE_SCHERMO").is_some() {
            eprintln!(
                "kalliope: monitors {list:?}, primary {primary:?}, saved {saved:?} -> size {:?}, position {:?}",
                chosen.size, chosen.position
            );
        }
    }
}

/// Whether `event` means Kalliope's window is gone: destroyed while Slint still holds it (`ours`). The window Slint lets
/// go of itself (hidden under Wayland, where hiding destroys it) reports `Destroyed` too, but is not Slint's any more.
fn gone(ours: bool, event: &WindowEvent) -> bool {
    ours && matches!(event, WindowEvent::Destroyed)
}

impl CustomApplicationHandler for Sentinella {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) -> EventResult {
        if !self.opened {
            self.open(event_loop);
        }
        EventResult::Propagate
    }

    fn window_event(
        &mut self,
        _event_loop: &ActiveEventLoop,
        _window_id: WindowId,
        _winit_window: Option<&Window>,
        slint_window: Option<&slint::Window>,
        event: &WindowEvent,
    ) -> EventResult {
        // Only Kalliope's window as Slint still holds it: a window Slint let go of itself (hidden under Wayland, where
        // hiding destroys it) is not the window gone.
        let ours =
            slint_window.is_some_and(|w| window().is_some_and(|ui| std::ptr::eq(w, ui.window())));
        if gone(ours, event) {
            GONE.set(true);
            let _ = slint::quit_event_loop();
        } else if let (true, WindowEvent::Moved(p)) = (ours, event)
            && !WAYLAND.get()
        {
            SEEN.set(Some((p.x, p.y)));
        }
        EventResult::Propagate
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const DESIGN: Measures = Measures {
        size: (920.0, 640.0),
        min: (360.0, 320.0),
        frame: (16.0, 48.0),
    };

    fn monitor(x: i32, y: i32, w: u32, h: u32) -> Monitor {
        Monitor {
            area: Rect { x, y, w, h },
            scale: 1.0,
        }
    }

    #[test]
    fn the_design_size_stays_where_it_fits() {
        assert_eq!(fit(&DESIGN, &monitor(0, 0, 1920, 1040)), (920.0, 640.0));
        // a 1366 × 768 laptop with a 40 px panel: 640 + 48 fits in 728
        assert_eq!(fit(&DESIGN, &monitor(0, 0, 1366, 728)), (920.0, 640.0));
    }

    #[test]
    fn a_small_work_area_gets_the_same_proportions_and_the_whole_window() {
        // the Windows runner: 1024 × 768 less a 48 px taskbar; and Xvfb at 1024 × 600 and 1280 × 720 less a 30 px panel
        for area in [
            monitor(0, 0, 1024, 720),
            monitor(0, 0, 1024, 600),
            monitor(0, 0, 1280, 690),
            monitor(0, 0, 800, 480),
        ] {
            let (w, h) = fit(&DESIGN, &area);
            assert!(
                w + DESIGN.frame.0 <= area.area.w as f32,
                "{area:?}: {w} wide"
            );
            assert!(
                h + DESIGN.frame.1 <= area.area.h as f32,
                "{area:?}: {h} high"
            );
            assert!(
                (w / h - 920.0 / 640.0).abs() < 0.01,
                "{area:?}: proportions {w}×{h}"
            );
            assert!(h <= 640.0);
        }
        assert_eq!(fit(&DESIGN, &monitor(0, 0, 1024, 600)), (793.0, 552.0));
    }

    #[test]
    fn the_smallest_window_is_the_floor() {
        // the height runs out first: the width follows the proportions, the height stops at the floor
        assert_eq!(fit(&DESIGN, &monitor(0, 0, 640, 300)), (362.0, 320.0));
        assert_eq!(fit(&DESIGN, &monitor(0, 0, 1920, 340)), (419.0, 320.0));
        // both at the floor on a screen smaller than the smallest window
        assert_eq!(fit(&DESIGN, &monitor(0, 0, 300, 200)), (360.0, 320.0));
    }

    #[test]
    fn a_scaled_monitor_counts_in_logical_pixels() {
        // 2560 × 1440 at 200 %: 1280 × 720 logical
        let hidpi = Monitor {
            area: Rect {
                x: 0,
                y: 0,
                w: 2560,
                h: 1440,
            },
            scale: 2.0,
        };
        assert_eq!(fit(&DESIGN, &hidpi), (920.0, 640.0));
        let small = Monitor {
            area: Rect {
                x: 0,
                y: 0,
                w: 2048,
                h: 1200,
            },
            scale: 2.0,
        };
        let (_, h) = fit(&DESIGN, &small);
        assert!((h + 48.0) * 2.0 <= 1200.0, "{h}");
    }

    #[test]
    fn a_remembered_place_comes_back_on_its_monitor() {
        let two = [monitor(0, 0, 1920, 1080), monitor(1920, 0, 1280, 1024)];
        let o = opening(&DESIGN, &two, Some(0), Some((2000, 100)), false);
        assert_eq!(o.position, Some((2000, 100)));
        assert_eq!(o.size, (920.0, 640.0));
        // a monitor left of the main one
        let left = [monitor(0, 0, 1920, 1080), monitor(-1440, 0, 1440, 900)];
        let o = opening(&DESIGN, &left, Some(0), Some((-1300, 50)), false);
        assert_eq!(o.position, Some((-1300, 50)));
    }

    #[test]
    fn a_place_half_off_its_monitor_is_moved_in() {
        let one = [monitor(0, 0, 1920, 1080)];
        // dragged half out to the right and the bottom
        let o = opening(&DESIGN, &one, Some(0), Some((1500, 900)), false);
        assert_eq!(o.position, Some((1920 - 936, 1080 - 688)));
        // above and left of the screen
        let o = opening(&DESIGN, &one, Some(0), Some((-200, -30)), false);
        assert_eq!(o.position, Some((0, 0)));
    }

    #[test]
    fn a_place_on_a_monitor_no_longer_connected_is_not_used() {
        // saved on a second monitor at the right, now unplugged
        let one = [monitor(0, 0, 1920, 1080)];
        let o = opening(&DESIGN, &one, Some(0), Some((2400, 200)), false);
        assert_eq!(o.position, None, "the system places it");
        assert_eq!(o.size, (920.0, 640.0));
        // saved on a large screen, now on a small one
        let small = [monitor(0, 0, 1024, 600)];
        let o = opening(&DESIGN, &small, Some(0), Some((1500, 700)), false);
        assert_eq!(o.position, None);
        assert_eq!(o.size, (793.0, 552.0));
        // a window that would reach the small screen from far away is moved in whole
        let o = opening(&DESIGN, &small, Some(0), Some((900, 500)), false);
        assert_eq!(o.position, Some((1024 - 809, 0)));
    }

    #[test]
    fn the_size_fits_the_monitor_the_window_opens_on() {
        let two = [monitor(0, 0, 1920, 1080), monitor(1920, 0, 1024, 600)];
        let o = opening(&DESIGN, &two, Some(0), Some((2000, 10)), false);
        assert_eq!(o.size, (793.0, 552.0), "remembered on the small one");
        let o = opening(&DESIGN, &two, Some(0), None, false);
        assert_eq!(
            o.size,
            (920.0, 640.0),
            "the primary, for the system to place"
        );
        // no primary (Wayland): the smallest, so that it fits wherever the compositor puts it
        let o = opening(&DESIGN, &two, None, None, false);
        assert_eq!(o.size, (793.0, 552.0));
        assert_eq!(o.position, None);
        // no monitor known: the design's size, the system's place
        assert_eq!(
            opening(&DESIGN, &[], None, Some((5, 5)), true),
            Opening {
                size: (920.0, 640.0),
                position: None
            }
        );
    }

    #[test]
    fn centred_in_the_work_area_when_asked() {
        // the Windows runner: the taskbar takes the bottom 48 px
        let runner = [monitor(0, 0, 1024, 720)];
        let o = opening(&DESIGN, &runner, Some(0), None, true);
        let (w, h) = (o.size.0 as i32 + 16, o.size.1 as i32 + 48);
        let (x, y) = o.position.unwrap();
        assert!(x >= 0 && y >= 0 && x + w <= 1024 && y + h <= 720, "{o:?}");
    }

    #[test]
    fn the_work_area_is_the_monitor_less_the_panels() {
        let m = Rect {
            x: 0,
            y: 0,
            w: 1280,
            h: 720,
        };
        // IceWM's taskbar at the bottom
        let net = Rect {
            x: 0,
            y: 0,
            w: 1280,
            h: 690,
        };
        assert_eq!(work_area(m, Some(net)), net);
        assert_eq!(work_area(m, None), m, "no window manager");
        // two monitors: _NET_WORKAREA spans both, each takes its part
        let right = Rect {
            x: 1280,
            y: 0,
            w: 1920,
            h: 1080,
        };
        let span = Rect {
            x: 0,
            y: 32,
            w: 3200,
            h: 1048,
        };
        assert_eq!(
            work_area(right, Some(span)),
            Rect {
                x: 1280,
                y: 32,
                w: 1920,
                h: 1048
            }
        );
        let elsewhere = Rect {
            x: 5000,
            y: 0,
            w: 10,
            h: 10,
        };
        assert_eq!(work_area(m, Some(elsewhere)), m);
    }

    #[test]
    fn the_window_destroyed_from_outside_ends_kalliope() {
        assert!(gone(true, &WindowEvent::Destroyed));
        // the window Slint destroyed itself to hide it (Wayland) is not Kalliope's window gone
        assert!(!gone(false, &WindowEvent::Destroyed));
        // closing goes through Slint's close request, which ends Kalliope by itself (main.rs)
        assert!(!gone(true, &WindowEvent::CloseRequested));
    }

    #[test]
    fn inside_keeps_a_window_larger_than_the_area_by_its_corner() {
        let area = Rect {
            x: 100,
            y: 50,
            w: 300,
            h: 200,
        };
        assert_eq!(inside((500, 500), (400, 300), &area), (100, 50));
        assert_eq!(inside((150, 60), (100, 100), &area), (150, 60));
    }
}
