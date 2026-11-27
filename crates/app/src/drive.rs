// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Creating a personal voice without the window, through the same [`Session`] calls the window
//! makes: for tests, for helpers working from a terminal, and for checking a microphone.
//!
//! - `kalliope --microfoni` lists the microphones a voice can be recorded from;
//! - `kalliope --registra-voce NOME [--microfono M] [--secondi S] [--frase TESTO] [--sostituisci]`
//!   records, makes the voice and, with `--frase`, says the phrase with it in the «Kalliope»
//!   microphone;
//! - `kalliope --importa-voce FILE NOME [--tratto N] [--frase TESTO] [--sostituisci]` does the same
//!   from an audio or video file;
//! - with `--ferma-dopo MS`, Stop is pressed that long after the phrase starts sounding, and what
//!   was said of it is shown.

use crate::engine::VoiceId;
use crate::own_voice::{self, CreateEvent, ImportEvent, NameCheck, RecordingEvent, Take};
use crate::session::{Session, Status};
use crate::{Phase, instance};
use std::path::PathBuf;
use std::process::ExitCode;
use std::sync::mpsc::{Receiver, channel};
use std::time::{Duration, Instant};

/// The options after the command's own arguments.
#[derive(Default)]
struct Options {
    microphone: Option<String>,
    seconds: Option<f32>,
    stretch: usize,
    phrase: Option<String>,
    replace: bool,
    /// Press Stop this long after the phrase starts sounding.
    stop_after: Option<Duration>,
}

fn options(args: &[String]) -> Result<(Vec<String>, Options), String> {
    let mut o = Options::default();
    let mut plain = Vec::new();
    let mut it = args.iter();
    while let Some(a) = it.next() {
        let mut value = || it.next().cloned().ok_or(format!("manca il valore di {a}"));
        match a.as_str() {
            "--microfono" => o.microphone = Some(value()?),
            "--secondi" => {
                o.seconds = Some(value()?.parse().map_err(|_| "--secondi vuole un numero")?)
            }
            "--tratto" => {
                o.stretch = value()?
                    .parse::<usize>()
                    .map_err(|_| "--tratto vuole un numero")?
                    .saturating_sub(1)
            }
            "--frase" => o.phrase = Some(value()?),
            "--sostituisci" => o.replace = true,
            "--ferma-dopo" => {
                o.stop_after = Some(Duration::from_millis(
                    value()?
                        .parse()
                        .map_err(|_| "--ferma-dopo vuole i millisecondi")?,
                ))
            }
            s if s.starts_with("--") => return Err(format!("opzione sconosciuta: {s}")),
            s => plain.push(s.to_string()),
        }
    }
    Ok((plain, o))
}

pub fn microphones() -> ExitCode {
    match own_voice::microphones() {
        Ok(list) if list.is_empty() => {
            eprintln!("Non trovo un microfono.");
            ExitCode::FAILURE
        }
        Ok(list) => {
            for m in list {
                println!(
                    "{} {}\t{}",
                    if m.default { "*" } else { " " },
                    m.name,
                    m.label
                );
            }
            ExitCode::SUCCESS
        }
        Err(e) => {
            eprintln!("{e}");
            ExitCode::FAILURE
        }
    }
}

/// A session without a window, and its status reports.
fn open() -> Result<(Session, Receiver<Status>, instance::Owner), ExitCode> {
    let owner = match instance::claim(&instance::folder()) {
        instance::Start::First(owner) => owner,
        instance::Start::Running(_) => {
            eprintln!("Kalliope è già aperta: crea la voce dalla sua finestra.");
            return Err(ExitCode::FAILURE);
        }
    };
    let (tx, rx) = channel();
    let session = Session::open(move |s| {
        let _ = tx.send(s);
    });
    Ok((session, rx, owner))
}

pub fn record(args: &[String]) -> ExitCode {
    let (plain, o) = match options(args) {
        Ok(x) => x,
        Err(e) => return usage_error(&e),
    };
    let [name] = &plain[..] else {
        return usage_error("scrivi il nome della voce");
    };
    let (mut session, status, _owner) = match open() {
        Ok(x) => x,
        Err(code) => return code,
    };
    println!("{}", own_voice::CONSENT);
    let (tx, rx) = channel();
    session.start_recording(o.microphone.clone(), move |e| {
        let _ = tx.send(e);
    });
    let seconds = o.seconds.unwrap_or(14.0);
    let mut started = None;
    let mut next_print = 0.0;
    let take = loop {
        match rx.recv_timeout(Duration::from_secs(10)) {
            Ok(RecordingEvent::Started { microphone }) => {
                println!("registro da «{microphone}»: parla ora");
                started = Some(Instant::now());
            }
            Ok(RecordingEvent::Level {
                rms,
                peak,
                seconds: s,
                speech_seconds,
            }) => {
                if s >= next_print {
                    println!(
                        "  {s:4.1} s · livello {:5.1} dB · picco {:5.1} dB · parlato {speech_seconds:4.1} s di {:.0}",
                        20.0 * (rms + 1e-9).log10(),
                        20.0 * (peak + 1e-9).log10(),
                        own_voice::TARGET_SPEECH_SECONDS
                    );
                    next_print = s + 0.5;
                }
                if started.is_some_and(|t| t.elapsed().as_secs_f32() >= seconds) {
                    session.stop_recording();
                }
            }
            Ok(RecordingEvent::Finished(take)) => break take,
            Ok(RecordingEvent::Failed(e)) => {
                eprintln!("{e}");
                return ExitCode::FAILURE;
            }
            Err(_) => {
                eprintln!("la registrazione non risponde");
                session.cancel_recording();
                return ExitCode::FAILURE;
            }
        }
    };
    if let Some(wav) = &take.wav {
        println!("registrazione: {}", wav.display());
    }
    finish(&mut session, &status, take, name, &o)
}

pub fn import(args: &[String]) -> ExitCode {
    let (plain, o) = match options(args) {
        Ok(x) => x,
        Err(e) => return usage_error(&e),
    };
    let [file, name] = &plain[..] else {
        return usage_error("scrivi il file e il nome della voce");
    };
    let (mut session, status, _owner) = match open() {
        Ok(x) => x,
        Err(code) => return code,
    };
    println!("{}", own_voice::CONSENT);
    let (tx, rx) = channel();
    session.import_voice_file(PathBuf::from(file), move |e| {
        let _ = tx.send(e);
    });
    let take = loop {
        match rx.recv_timeout(Duration::from_secs(60)) {
            Ok(ImportEvent::Progress(p)) => {
                if p >= 1.0 {
                    println!("  file letto");
                }
            }
            Ok(ImportEvent::Finished(take)) => break take,
            Ok(ImportEvent::Failed(e)) => {
                eprintln!("{e}");
                return ExitCode::FAILURE;
            }
            Err(_) => {
                eprintln!("la lettura del file non risponde");
                session.cancel_import();
                return ExitCode::FAILURE;
            }
        }
    };
    finish(&mut session, &status, take, name, &o)
}

/// Shows the take, makes the voice, chooses it and says the phrase.
fn finish(
    session: &mut Session,
    status: &Receiver<Status>,
    take: Take,
    name: &str,
    o: &Options,
) -> ExitCode {
    let origin = match &take.origin {
        own_voice::Origin::Microphone(m) => format!("dal microfono «{m}»"),
        own_voice::Origin::File(f) => format!("dal file {}", f.display()),
    };
    println!(
        "{origin}: {:.1} s, {:.1} s di parlato, livello {:.0} dB, rumore a {:.0} dB sotto la voce",
        take.seconds, take.quality.speech_seconds, take.quality.level_db, take.quality.snr_db
    );
    for (i, s) in take.stretches.iter().enumerate() {
        println!(
            "  tratto {}: {:.1}–{:.1} s, punteggio {:.2}, parlato {:.1} s",
            i + 1,
            s.start,
            s.end,
            s.score,
            s.quality.speech_seconds
        );
        for m in take.messages(i) {
            println!("    {m}");
        }
    }
    if take.stretches.is_empty() {
        for m in take.messages(0) {
            println!("  {m}");
        }
    }
    match session.listen(&take, o.stretch) {
        Ok(d) => {
            std::thread::sleep(Duration::from_millis(300));
            println!(
                "ascolto del tratto {} dalle casse: {:.1} s (ne restano {:.1})",
                o.stretch + 1,
                d.as_secs_f32(),
                session.listening_left()
            );
            session.stop_listening();
        }
        Err(e) => println!("{e}"),
    }
    // What the window would ask; --sostituisci is the person's yes.
    let check = session.check_voice_name(name);
    if o.replace
        && !matches!(check, NameCheck::Free { .. })
        && let Some(m) = check.message()
    {
        println!("{m} Sì.");
    }
    let (tx, rx) = channel();
    let started = Instant::now();
    if let Err(check) = session.create_voice(&take, o.stretch, name, o.replace, move |e| {
        let _ = tx.send(e);
    }) {
        eprintln!("{}", check.message().unwrap_or_default());
        return ExitCode::FAILURE;
    }
    let id = loop {
        match rx.recv_timeout(Duration::from_secs(120)) {
            Ok(CreateEvent::Progress(p)) => println!("  creo la voce… {:.0}%", p * 100.0),
            Ok(CreateEvent::Done(id)) => break id,
            Ok(CreateEvent::Failed(e)) => {
                eprintln!("{e}");
                return ExitCode::FAILURE;
            }
            Err(_) => {
                eprintln!("la creazione della voce non risponde");
                session.cancel_voice();
                return ExitCode::FAILURE;
            }
        }
    };
    session.refresh_voices();
    let Some(index) = session.voice_position(&id) else {
        eprintln!("la voce «{}» non è nel menu", id.label());
        return ExitCode::FAILURE;
    };
    println!(
        "voce «{}» creata in {:.1} s, al posto {} del menu",
        id.label(),
        started.elapsed().as_secs_f32(),
        index + 1
    );
    let Some(phrase) = &o.phrase else {
        return ExitCode::SUCCESS;
    };
    say(session, status, &id, index, phrase, o.stop_after)
}

/// Chooses the voice and says `phrase` with it in the «Kalliope» microphone.
fn say(
    session: &mut Session,
    status: &Receiver<Status>,
    id: &VoiceId,
    index: usize,
    phrase: &str,
    stop_after: Option<Duration>,
) -> ExitCode {
    let wait = |until: &dyn Fn(&Status) -> bool, within: Duration| -> Option<Status> {
        let deadline = Instant::now() + within;
        while let Ok(s) = status.recv_timeout(deadline.saturating_duration_since(Instant::now())) {
            if s.phase == Phase::Error {
                eprintln!("{}", s.text);
                return None;
            }
            if until(&s) {
                return Some(s);
            }
        }
        None
    };
    if wait(&|s| s.phase != Phase::Loading, Duration::from_secs(60)).is_none() {
        return ExitCode::FAILURE;
    }
    session.change_voice(index);
    if wait(&|s| s.voice_index == Some(index), Duration::from_secs(60)).is_none() {
        eprintln!("la voce «{}» non si è aperta", id.label());
        return ExitCode::FAILURE;
    }
    if !session.speak(phrase) {
        return ExitCode::FAILURE;
    }
    let start = Instant::now();
    let deadline = start + Duration::from_secs(120);
    let (mut printed, mut speaking) = (None, false);
    let mut sounding_since: Option<Instant> = None;
    let mut stop_after = stop_after;
    loop {
        let wait = match (stop_after, sounding_since) {
            (Some(after), Some(since)) => (since + after).saturating_duration_since(Instant::now()),
            _ => deadline.saturating_duration_since(Instant::now()),
        };
        let s = match status.recv_timeout(wait) {
            Ok(s) => s,
            Err(_) if stop_after.is_some() && sounding_since.is_some() => {
                println!("Ferma, a {} ms", start.elapsed().as_millis());
                session.stop();
                stop_after = None;
                continue;
            }
            Err(_) => {
                eprintln!("la frase non è finita in tempo");
                return ExitCode::FAILURE;
            }
        };
        if let Some(said) = &s.interrupted {
            let cut = said.cut.as_ref().map_or(String::new(), |(r, share)| {
                format!(
                    ", e «{}» solo al {:.0}%",
                    &said.phrase[r.clone()],
                    share * 100.0
                )
            });
            println!(
                "detto per intero fino al byte {}: «{}»{cut}",
                said.done,
                &said.phrase[..said.done]
            );
        }
        if s.sounding.is_some() && sounding_since.is_none() {
            sounding_since = Some(Instant::now());
        }
        if s.phase == Phase::Error {
            eprintln!("{}", s.text);
            return ExitCode::FAILURE;
        }
        if let Some(p) = &s.sounding {
            let key = (p.id, p.span.start, p.exact);
            if printed != Some(key) {
                println!("{}", trace(p, start));
                printed = Some(key);
            }
        }
        speaking |= s.phase == Phase::Speaking;
        if speaking && s.phase == Phase::Ready {
            break;
        }
    }
    // Apps receive audio in blocks: keep the microphone a moment longer.
    std::thread::sleep(Duration::from_millis(1000));
    println!("detta con la voce «{}»", id.label());
    ExitCode::SUCCESS
}

/// One line for a piece that starts sounding: when (ms since `start`, and on the wall clock, to set it against a recording
/// of the microphone), what it says and for how long.
pub fn trace(s: &crate::engine::Sounding, start: Instant) -> String {
    let wall = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_or(0.0, |d| d.as_secs_f64());
    let words: Vec<String> = s
        .words
        .iter()
        .map(|w| format!("{}:{:.4}", w.byte, w.share))
        .collect();
    format!(
        "avanzamento {:6} ms · ora {wall:.3} · {:5} ms{} · byte {}..{} · «{}»{} · parole {}",
        start.elapsed().as_millis(),
        s.duration.as_millis(),
        if s.exact { "" } else { " (stima)" },
        s.span.start,
        s.span.end,
        &s.phrase[s.span.clone()],
        if s.last { " · ultimo" } else { "" },
        words.join(" ")
    )
}

fn usage_error(e: &str) -> ExitCode {
    eprintln!(
        "{e}\n\nuso:\n  kalliope --microfoni\n  kalliope --registra-voce NOME [--microfono M] [--secondi S] [--frase TESTO] [--sostituisci]\n  kalliope --importa-voce FILE NOME [--tratto N] [--frase TESTO] [--sostituisci]"
    );
    ExitCode::from(2)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn options_are_read_in_any_order() {
        let args: Vec<String> = ["--frase", "ciao", "Anna", "--tratto", "2", "--sostituisci"]
            .iter()
            .map(|s| s.to_string())
            .collect();
        let (plain, o) = options(&args).unwrap();
        assert_eq!(plain, ["Anna"]);
        assert_eq!(
            (o.stretch, o.replace, o.phrase.as_deref()),
            (1, true, Some("ciao"))
        );
        assert!(options(&["--secondi".into()]).is_err());
        assert!(options(&["--boh".into()]).is_err());
    }
}
