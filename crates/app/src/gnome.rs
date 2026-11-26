// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! GTK runs its own main loop. Only presentation events cross these local pipes.
use super::{
    Phase,
    session::{Session, Status},
    version,
};
use serde_json::{Value, json};
use std::io::{self, BufRead, BufReader, Write};
use std::process::{Command, Stdio};
use std::sync::mpsc;

include!(concat!(env!("OUT_DIR"), "/native_tokens.rs"));

pub fn active() -> bool {
    std::env::var("XDG_CURRENT_DESKTOP")
        .unwrap_or_default()
        .split(':')
        .any(|name| name.eq_ignore_ascii_case("gnome"))
}

enum Event {
    Action(Value),
    Status(Status),
    Closed,
}

fn send(out: &mut impl Write, message: Value) -> io::Result<()> {
    serde_json::to_writer(&mut *out, &message)?;
    out.write_all(b"\n")?;
    out.flush()
}

pub fn run() -> io::Result<()> {
    let mut child = Command::new("/usr/bin/python3")
        .args(["-Iu", "-c", include_str!("../ui/gnome.py")])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()?;
    let mut out = child.stdin.take().expect("piped stdin");
    let input = child.stdout.take().expect("piped stdout");
    let (tx, rx) = mpsc::channel();
    let reader = tx.clone();
    std::thread::spawn(move || {
        for row in BufReader::new(input).lines().map_while(Result::ok) {
            if let Ok(action) = serde_json::from_str(&row)
                && reader.send(Event::Action(action)).is_err()
            {
                break;
            }
        }
        let _ = reader.send(Event::Closed);
    });
    let mut app = Session::open(move |status| {
        let _ = tx.send(Event::Status(status));
    });
    let result = (|| {
        send(
            &mut out,
            json!({"type":"init","voices":app.voices,"voice":app.voice_index(),
            "monitor":app.settings.monitor,"version":version(),"spacing":SPACING, "width":WINDOW_WIDTH, "height":WINDOW_HEIGHT, "min_width":MIN_WINDOW_WIDTH, "min_height":MIN_WINDOW_HEIGHT}),
        )?;
        for event in rx {
            match event {
                Event::Closed => break,
                Event::Status(state) => {
                    let phase = match state.phase {
                        Phase::Ready => "ready",
                        Phase::Speaking => "speaking",
                        Phase::Error => "error",
                        Phase::Loading => "loading",
                    };
                    send(
                        &mut out,
                        json!({"type":"status","phase":phase,"text":state.text,"warning":state.warning}),
                    )?;
                }
                Event::Action(action) => match action["type"].as_str() {
                    Some("speak") => {
                        if let Some(text) = action["text"].as_str()
                            && app.speak(text)
                        {
                            if let Some(id) = action["id"].as_u64() {
                                send(&mut out, json!({"type":"accepted","id":id}))?;
                            }
                            send(&mut out, json!({"type":"history","items":app.history}))?;
                        } else if let Some(id) = action["id"].as_u64() {
                            send(&mut out, json!({"type":"rejected","id":id}))?;
                        }
                    }
                    Some("stop") => app.stop(),
                    Some("voice") => {
                        if let Some(index) = action["index"]
                            .as_u64()
                            .and_then(|i| usize::try_from(i).ok())
                        {
                            app.change_voice(index);
                        }
                    }
                    Some("monitor") => {
                        if let Some(on) = action["enabled"].as_bool() {
                            app.monitor(on);
                        }
                    }
                    _ => {}
                },
            }
        }
        Ok(())
    })();
    drop(out);
    let status = child.wait()?;
    if !status.success() {
        return Err(io::Error::other(
            "Impossibile avviare l’interfaccia GNOME. Servono Python 3, PyGObject, GTK 4 e libadwaita.",
        ));
    }
    result
}
