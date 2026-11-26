# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""A stand-in for the XDG settings portal, for tests of the window's light and dark appearance on Linux.

    python3 -I tools/portale_finto.py dark|light|none [--flip-after SECONDS dark|light|none] [-- COMMAND ...]

Serves org.freedesktop.appearance `color-scheme` (1 dark, 2 light, 0 no preference) on the session bus it is run in, as
xdg-desktop-portal does (ReadOne, Read, and the SettingChanged signal): Slint's winit backend reads exactly this. With a
COMMAND, runs it once the service answers and exits with its status; without, serves until stopped. Needs the system's
PyGObject (python3-gi) and a session bus of its own, e.g.:

    xvfb-run -a dbus-run-session -- python3 -I tools/portale_finto.py dark -- python3 tools/check_desktop.py window.png

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
    rest = argv[1:]
    if "--" in rest:
        i = rest.index("--")
        rest, command = rest[:i], rest[i + 1:]
    if rest[:1] == ["--flip-after"] and len(rest) == 3 and rest[2] in VALUES:
        flip = (float(rest[1]), rest[2])
    elif rest:
        raise SystemExit(__doc__)
    return scheme, flip, command


def main(argv):
    scheme, flip, command = parse(argv)
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

    def acquired(connection, name):
        state["bus"] = connection
        node = Gio.DBusNodeInfo.new_for_xml(XML)
        connection.register_object(PATH, node.interfaces[0], call, None, None)

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
