"""Apply export.py's strip_metadata to a copy of a V-4 graph and compare bytes with a newly exported graph."""
import hashlib, shutil, sys, tempfile
from pathlib import Path
sys.path.insert(0, "/workspace/kalliope/tools/pocket_export")
from export import strip_metadata
old, new = Path(sys.argv[1]), Path(sys.argv[2])
with tempfile.TemporaryDirectory(dir="/tmp", prefix="p2-strip-") as d:
    copy = Path(d) / old.name
    shutil.copyfile(old, copy)
    strip_metadata(copy)
    a, b = copy.read_bytes(), new.read_bytes()
h = lambda x: hashlib.sha256(x).hexdigest()
print(f"{new.name}: V-4 {old.stat().st_size} B -> stripped {len(a)} B sha256 {h(a)[:16]}; new {len(b)} B sha256 {h(b)[:16]}:", "IDENTICAL" if a == b else "DIFFERENT")
