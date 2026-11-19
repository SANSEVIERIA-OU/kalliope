# Accepts connections on 127.0.0.1:8931 and never answers: a download that stays at 0 MB.
import socket, time
s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(("127.0.0.1", 8931)); s.listen(8); held = []
while True:
    c, _ = s.accept(); held.append(c)
