"""Compare two ONNX files: initializers by content, nodes by structure, metadata."""
import sys, hashlib, collections
import onnx
from onnx import numpy_helper

def load(p):
    m = onnx.load(p)
    g = m.graph
    inits = {i.name: hashlib.sha256(numpy_helper.to_array(i).tobytes()).hexdigest()[:16] + str(list(i.dims)) for i in g.initializer}
    return m, g, inits

a, b = sys.argv[1], sys.argv[2]
ma, ga, ia = load(a)
mb, gb, ib = load(b)
print("producer", ma.producer_name, ma.producer_version, "|", mb.producer_name, mb.producer_version)
print("opsets", [(o.domain, o.version) for o in ma.opset_import], [(o.domain, o.version) for o in mb.opset_import])
print("nodes", len(ga.node), len(gb.node), "inits", len(ia), len(ib))
print("init names equal:", set(ia) == set(ib))
ca = collections.Counter(ia.values()); cb = collections.Counter(ib.values())
print("init contents equal (multiset):", ca == cb)
if set(ia) == set(ib):
    d = [k for k in ia if ia[k] != ib[k]]
    print("inits differing by name:", len(d), d[:5])
ops_a = [n.op_type for n in ga.node]; ops_b = [n.op_type for n in gb.node]
print("op sequence equal:", ops_a == ops_b, collections.Counter(ops_a) == collections.Counter(ops_b))
sa = [(n.op_type, tuple(n.input), tuple(n.output), n.name) for n in ga.node]
sb = [(n.op_type, tuple(n.input), tuple(n.output), n.name) for n in gb.node]
print("node io+names equal:", sa == sb)
diffs = [(x, y) for x, y in zip(sa, sb) if x != y]
print("first differing nodes:", diffs[:3])
attr = lambda n: [(at.name, onnx.helper.get_attribute_value(at)) for at in n.attribute if at.type != onnx.AttributeProto.GRAPH]
ad = [(x.name, y.name) for x, y in zip(ga.node, gb.node) if str(attr(x)) != str(attr(y))]
print("nodes with different attributes:", len(ad), ad[:3])
print("metadata", [(p.key, p.value[:60]) for p in ma.metadata_props], [(p.key, p.value[:60]) for p in mb.metadata_props])
print("value_info", len(ga.value_info), len(gb.value_info))
