# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""A stand-in for the XDG settings portal, for tests of the window's light and dark appearance on Linux.

    python3 -I tools/portale_finto.py dark|light|none [--flip-after SECONDS dark|light|none]
        [--scegli FILE | --annulla] [--ritardo SECONDS] [--registro FILE.json] [-- COMMAND ...]

Serves org.freedesktop.appearance `color-scheme` (1 dark, 2 light, 0 no preference) on the session bus it is run in, as
xdg-desktop-portal does (ReadOne, Read, and the SettingChanged signal): Slint's winit backend reads exactly this. With a
COMMAND, runs it once the service answers and exits with its status; without, serves until stopped. Needs the system's
PyGObject (python3-gi) and a session bus of its own, e.g.:

    xvfb-run -a -s "-screen 0 1280x900x24" dbus-run-session -- python3 -I tools/portale_finto.py dark -- python3 tools/check_desktop.py window.png

With --scegli FILE (or --annulla; --scegli @CONTROL reads the file to answer with from CONTROL at each call, so one run can
answer different files, and an empty CONTROL answers a cancel) it also serves org.freedesktop.portal.FileChooser: OpenFile answers with FILE (or a cancel)
after --ritardo seconds (0.4), the way a person would take a moment, and --registro writes what the program asked for (title,
filters, parent window) to a JSON file: Kalliope's «Usa vecchie registrazioni» reaches the real portal route, without a desktop.

It never touches the user's session: dbus-run-session makes a bus that only this command's children see.
"""
import subprocess
import sys

VALUES = {"dark": 1, "light": 2, "none": 0}
INTERFACE = "org.freedesktop.portal.Settings"
PATH = "/org/freedesktop/portal/desktop"
XML = f"""
<node><interface name="{INTERFACE}">
  <method name="ReadOne"><arg type="s" direction="in"/><arg type="s" direction="in"/><arg type="v" direction="out"/></method>
  <method name="Read"><arg type="s" direction="in"/><arg type="s" direction="in"/><arg type="v" direction="out"/></method>
  <signal name="SettingChanged"><arg type="s"/><arg type="s"/><arg type="v"/></signal>
</interface></node>"""


def parse(argv):
    if not argv or argv[0] not in VALUES:
        raise SystemExit(__doc__)
    scheme, flip, command = argv[0], None, []
    chooser = {"file": None, "cancel": False, "delay": 0.4, "log": None}
    rest = argv[1:]
    if "--" in rest:
        i = rest.index("--")
        rest, command = rest[:i], rest[i + 1:]
    while rest:
        if rest[0] == "--flip-after" and len(rest) >= 3 and rest[2] in VALUES:
            flip = (float(rest[1]), rest[2])
            rest = rest[3:]
        elif rest[0] == "--scegli" and len(rest) >= 2:
            chooser["file"] = rest[1]
            rest = rest[2:]
        elif rest[0] == "--annulla":
            chooser["cancel"] = True
            rest = rest[1:]
        elif rest[0] == "--ritardo" and len(rest) >= 2:
            chooser["delay"] = float(rest[1])
            rest = rest[2:]
        elif rest[0] == "--registro" and len(rest) >= 2:
            chooser["log"] = rest[1]
            rest = rest[2:]
        else:
            raise SystemExit(__doc__)
    return scheme, flip, command, chooser


CHOOSER_XML = """
<node><interface name="org.freedesktop.portal.FileChooser">
  <method name="OpenFile"><arg type="s" direction="in"/><arg type="s" direction="in"/><arg type="a{sv}" direction="in"/><arg type="o" direction="out"/></method>
  <property name="version" type="u" access="read"/>
</interface></node>"""


def main(argv):
    scheme, flip, command, chooser = parse(argv)
    import gi
    gi.require_version("Gio", "2.0")
    from gi.repository import Gio, GLib

    state = {"scheme": VALUES[scheme], "bus": None, "child": None}
    loop = GLib.MainLoop()

    def call(connection, sender, path, iface, method, params, invocation):
        namespace, key = params.unpack()
        if namespace == "org.freedesktop.appearance" and key == "color-scheme":
            value = GLib.Variant("u", state["scheme"])
            if method == "Read":  # the deprecated call wraps the value once more
                value = GLib.Variant("v", value)
            invocation.return_value(GLib.Variant("(v)", (value,)))
        else:
            invocation.return_dbus_error("org.freedesktop.portal.Error.NotFound", "no such setting")

    def open_file(connection, sender, path, iface, method, params, invocation):
        import json
        parent, title, options = params.unpack()
        token = options.get("handle_token", "kalliope")
        request = "/org/freedesktop/portal/desktop/request/%s/%s" % (sender.lstrip(":").replace(".", "_"), token)
        if chooser["log"]:
            with open(chooser["log"], "w") as f:
                json.dump({"parent_window": parent, "title": title, "options": {k: str(v) for k, v in options.items()}}, f, indent=1)
        invocation.return_value(GLib.Variant("(o)", (request,)))

        chosen = chooser["file"]
        if chosen and chosen.startswith("@"):
            try:
                chosen = open(chosen[1:]).read().strip() or None
            except OSError:
                chosen = None

        def answer():
            if chooser["cancel"] or not chosen:
                reply = GLib.Variant("(ua{sv})", (1, {}))
            else:
                reply = GLib.Variant("(ua{sv})", (0, {"uris": GLib.Variant("as", ["file://" + chosen])}))
            connection.emit_signal(sender, request, "org.freedesktop.portal.Request", "Response", reply)
            return False

        GLib.timeout_add(int(chooser["delay"] * 1000), answer)

    def acquired(connection, name):
        state["bus"] = connection
        node = Gio.DBusNodeInfo.new_for_xml(XML)
        connection.register_object(PATH, node.interfaces[0], call, None, None)
        if chooser["file"] or chooser["cancel"]:
            node2 = Gio.DBusNodeInfo.new_for_xml(CHOOSER_XML)
            connection.register_object(PATH, node2.interfaces[0], open_file,
                                       lambda *a: GLib.Variant("u", 3), None)

    def owned(connection, name):
        if command:
            state["child"] = subprocess.Popen(command)
            GLib.timeout_add(50, poll)

    def poll():
        code = state["child"].poll()
        if code is None:
            return True
        state["exit"] = code
        loop.quit()
        return False

    def change(new):
        state["scheme"] = VALUES[new]
        state["bus"].emit_signal(
            None, PATH, INTERFACE, "SettingChanged",
            GLib.Variant("(ssv)", ("org.freedesktop.appearance", "color-scheme", GLib.Variant("u", state["scheme"]))),
        )
        return False

    Gio.bus_own_name(Gio.BusType.SESSION, "org.freedesktop.portal.Desktop", Gio.BusNameOwnerFlags.NONE, acquired, owned, None)
    if flip:
        GLib.timeout_add(int(flip[0] * 1000), change, flip[1])
    try:
        loop.run()
    except KeyboardInterrupt:
        pass
    if state["child"] and state["child"].poll() is None:
        state["child"].terminate()
    return state.get("exit", 0)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
