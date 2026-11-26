# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Native GNOME window. The Rust process owns audio, settings and history.

Only JSON Lines cross the pipes; diagnostics belong on stderr. Appearance is
provided by GTK/libadwaita, and layout spacing arrives from the shared tokens.
"""
import gettext
import json
import os
import sys

import gi

gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")
from gi.repository import Adw, Gio, GLib, Gtk

_ = gettext.gettext
APP_ID = "io.github.sansevieria_ou.kalliope"


class Kalliope(Adw.Application):
    def __init__(self):
        super().__init__(application_id=APP_ID, flags=Gio.ApplicationFlags.NON_UNIQUE)
        self.phase = "loading"
        self.initializing = True
        self.version = ""
        self.pending = b""
        self.next_id = 0
        self.submitted = {}
        self.draft_revision = 0
        self.window = None
        self.connect("activate", self.activate_window)

    def emit_command(self, **command):
        try:
            print(json.dumps(command, ensure_ascii=False), flush=True)
            return True
        except (BrokenPipeError, OSError):
            self.quit()
            return False

    def activate_window(self, _app):
        if self.window:
            self.window.present()
            return
        self.window = Adw.ApplicationWindow(application=self, title="Kalliope")
        self.window.set_icon_name(APP_ID)
        root = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        header = Adw.HeaderBar()
        info = Gtk.Button(icon_name="help-about-symbolic", tooltip_text=_("Informazioni su Kalliope"))
        info.connect("clicked", self.show_about)
        header.pack_end(info)
        root.append(header)
        self.body = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        outer_scroll = Gtk.ScrolledWindow(hscrollbar_policy=Gtk.PolicyType.NEVER, vexpand=True)
        outer_scroll.set_child(self.body)
        root.append(outer_scroll)
        self.window.set_content(root)

        self.status_row = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL)
        self.status_icon = Gtk.Image(icon_name="content-loading-symbolic")
        self.status = Gtk.Label(label=_("Preparo la voce…"), xalign=0, wrap=True, hexpand=True)
        self.status_row.append(self.status_icon)
        self.status_row.append(self.status)
        self.body.append(self.status_row)

        heading = Gtk.Label(label=_("Che cosa vuoi dire?"), xalign=0)
        heading.add_css_class("title-2")
        self.body.append(heading)
        self.entry = Gtk.Entry(placeholder_text=_("Scrivi qui e premi Invio per parlare"), hexpand=True)
        self.entry.update_property([Gtk.AccessibleProperty.LABEL], [_("Testo da dire")])
        self.entry.connect("activate", self.speak_draft)
        self.entry.connect("changed", self.draft_changed)
        self.body.append(self.entry)
        actions = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL)
        self.speak = Gtk.Button(label=_("Parla"), hexpand=True)
        self.speak.add_css_class("suggested-action")
        self.speak.connect("clicked", self.speak_draft)
        self.stop = Gtk.Button(label=_("Ferma"))
        self.stop.connect("clicked", self.stop_speaking)
        actions.append(self.speak)
        actions.append(self.stop)
        self.body.append(actions)

        preferences = Adw.PreferencesGroup()
        self.voice = Adw.ComboRow(title=_("Voce"))
        self.voice.connect("notify::selected", self.select_voice)
        preferences.add(self.voice)
        monitor_row = Adw.ActionRow(title=_("Senti anche tu"))
        self.monitor = Gtk.Switch(valign=Gtk.Align.CENTER)
        self.monitor.connect("notify::active", self.change_monitor)
        monitor_row.add_suffix(self.monitor)
        monitor_row.set_activatable_widget(self.monitor)
        preferences.add(monitor_row)
        self.body.append(preferences)

        self.history_title = Gtk.Label(label=_("Già detto"), xalign=0)
        self.history_title.add_css_class("heading")
        self.body.append(self.history_title)
        self.empty = Gtk.Label(label=_("Le frasi che dici restano qui, per ripeterle."), xalign=0, wrap=True)
        self.empty.add_css_class("dim-label")
        self.body.append(self.empty)
        self.history = Gtk.ListBox(selection_mode=Gtk.SelectionMode.NONE)
        self.history.add_css_class("boxed-list")
        self.history.connect("row-activated", self.repeat)
        self.body.append(self.history)
        self.spaced = [self.body, self.status_row, actions]
        settings = Gtk.Settings.get_default()
        settings.connect("notify::gtk-font-name", self.reserve_status_lines)
        settings.connect("notify::gtk-xft-dpi", self.reserve_status_lines)
        self.refresh_controls()
        os.set_blocking(sys.stdin.fileno(), False)
        GLib.io_add_watch(sys.stdin.fileno(), GLib.IO_IN | GLib.IO_HUP | GLib.IO_ERR, self.read_messages)
        # Presentation waits for init so shared dimensions and settings never flash.

    def reserve_status_lines(self, *_args):
        # Measure two lines in the system font, including font-size preferences.
        layout = self.status.create_pango_layout("Ag\nAg")
        self.status.set_size_request(-1, layout.get_pixel_size()[1])

    def draft_changed(self, *_args):
        self.draft_revision += 1
        self.refresh_controls()

    def set_spacing(self, spacing):
        self.spacing = max(1, round(float(spacing)))
        for box in self.spaced:
            box.set_spacing(self.spacing)
        for side in ("top", "bottom", "start", "end"):
            getattr(self.body, "set_margin_" + side)(self.spacing * 2)

    def read_messages(self, fd, condition):
        try:
            data = os.read(fd, 65536)
        except BlockingIOError:
            return True
        except OSError:
            self.quit()
            return False
        if not data:
            self.quit()
            return False
        self.pending += data
        while b"\n" in self.pending:
            line, self.pending = self.pending.split(b"\n", 1)
            try:
                self.receive(json.loads(line))
            except (ValueError, TypeError, KeyError) as error:
                print("Invalid Kalliope UI message: " + str(error), file=sys.stderr)
        return True

    def receive(self, message):
        kind = message["type"]
        if kind == "init":
            self.initializing = True
            self.version = message["version"]
            self.set_spacing(message["spacing"])
            self.window.set_default_size(message["width"], message["height"])
            self.window.set_size_request(message["min_width"], message["min_height"])
            self.reserve_status_lines()
            self.voice.set_model(Gtk.StringList.new(message["voices"]))
            self.voice.set_selected(message["voice"])
            self.monitor.set_active(message["monitor"])
            self.initializing = False
            self.window.present()
            self.entry.grab_focus()
        elif kind == "status":
            self.phase = message["phase"]
            self.status.set_text(message["text"])
            warning = message.get("warning", False)
            self.status_icon.set_from_icon_name("dialog-warning-symbolic" if warning else {
                "loading": "content-loading-symbolic", "ready": "audio-input-microphone-symbolic",
                "speaking": "audio-volume-high-symbolic", "error": "dialog-error-symbolic",
            }.get(self.phase, "dialog-information-symbolic"))
            for style in ("warning", "error"):
                self.status_row.remove_css_class(style)
            if warning or self.phase == "error":
                self.status_row.add_css_class("error" if self.phase == "error" else "warning")
            self.refresh_controls()
        elif kind == "rejected":
            self.submitted.pop(message["id"], None)
        elif kind == "accepted":
            draft = self.submitted.pop(message.get("id"), None)
            if draft is not None and draft == (self.draft_revision, self.entry.get_text()):
                self.entry.set_text("")
        elif kind == "history":
            child = self.history.get_first_child()
            while child:
                following = child.get_next_sibling()
                self.history.remove(child)
                child = following
            for phrase in message["items"]:
                row = Adw.ActionRow(title=GLib.markup_escape_text(phrase), activatable=True)
                row.phrase = phrase
                row.set_title_lines(2)
                row.set_tooltip_text(phrase)
                row.add_suffix(Gtk.Image(icon_name="media-playback-start-symbolic"))
                row.update_property([Gtk.AccessibleProperty.LABEL], [_("Ripeti: ") + phrase])
                self.history.append(row)
            self.empty.set_visible(not message["items"])
            self.history.set_visible(bool(message["items"]))

    def refresh_controls(self):
        enabled = self.phase in ("ready", "speaking")
        self.speak.set_sensitive(enabled and bool(self.entry.get_text().strip()))
        self.stop.set_sensitive(self.phase == "speaking")
        self.history.set_sensitive(enabled)

    def speak_draft(self, *_):
        text = self.entry.get_text().strip()
        if self.phase in ("ready", "speaking") and text:
            self.next_id += 1
            self.submitted[self.next_id] = (self.draft_revision, self.entry.get_text())
            self.emit_command(type="speak", text=text, id=self.next_id)
        self.entry.grab_focus()

    def repeat(self, _list, row):
        if self.phase in ("ready", "speaking"):
            self.emit_command(type="speak", text=row.phrase)
        self.entry.grab_focus()

    def stop_speaking(self, *_):
        self.emit_command(type="stop")
        self.entry.grab_focus()

    def select_voice(self, *_):
        if not self.initializing:
            self.emit_command(type="voice", index=self.voice.get_selected())

    def change_monitor(self, *_):
        if not self.initializing:
            self.emit_command(type="monitor", enabled=self.monitor.get_active())

    def show_about(self, *_args):
        about = Adw.AboutWindow(transient_for=self.window, modal=True,
            application_name="Kalliope", application_icon=APP_ID, version=self.version,
            developer_name="SANSEVIERIA OÜ", copyright="© SANSEVIERIA OÜ",
            comments=_("Scrivi e fatti sentire nelle videochiamate. La voce viene creata su questo computer: nessun testo lascia la tua macchina."),
            website="https://sansevieria-ou.github.io/kalliope", license_type=Gtk.License.CUSTOM,
            license="SANSEVIERIA 1.1")
        about.add_legal_section("Klein-TTS-X1.5-Pro", None, Gtk.License.APACHE_2_0, None)
        about.add_legal_section("ONNX Runtime", None, Gtk.License.MIT_X11, None)
        about.add_legal_section("Wiktionary", None, Gtk.License.CUSTOM,
            _("Dati di pronuncia da Wiktionary (CC BY-SA 4.0)."))
        about.add_legal_section("Pocket TTS · Kyutai", "© Kyutai", Gtk.License.CUSTOM,
            _("Pocket TTS di Kyutai (kyutai.org), CC BY 4.0; convertito in ONNX e quantizzato da Kalliope. Fonte, modifiche e licenza nei file share/doc/kalliope/pocket-tts/NOTICE.txt e LICENSE del pacchetto."))
        about.present()


if __name__ == "__main__":
    sys.exit(Kalliope().run([]))
