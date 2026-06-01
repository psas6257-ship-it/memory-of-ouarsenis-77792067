import { mapLocations as seed } from "@/data/heritage";
import { Edit3, Plus, MapPin } from "lucide-react";
import { useState } from "react";
import { useLocalList } from "@/lib/use-local-list";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { toast } from "sonner";

type Row = { id?: any; name: string; type: string; description: string; lat?: number; lng?: number };

function MapAdmin() {
  const { items, add, update, remove } = useLocalList<Row>("mom-admin-map", seed as any);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const save = (r: Row) => {
    if (!r.name) return toast.error("الاسم مطلوب");
    if (r.id) update(r.id, r); else add(r);
    toast.success("تم الحفظ"); setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>المواقع التراثية</h1>
          <p className="text-sm text-white/55 mt-1">{items.length} موقعاً على الخريطة</p>
        </div>
        <button onClick={() => { setEditing({ name: "", type: "", description: "" }); setOpen(true); }} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((m: Row, i) => (
          <div key={m.id ?? i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--gold)]/15 grid place-items-center shrink-0"><MapPin className="h-4 w-4 text-[var(--gold)]" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{m.name}</p>
              <p className="text-[10px] text-[var(--gold)] mt-0.5">{m.type}</p>
              <p className="text-[11px] text-white/55 mt-1 line-clamp-2">{m.description}</p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button onClick={() => { setEditing(m); setOpen(true); }} className="h-7 w-7 rounded-lg bg-white/5 grid place-items-center"><Edit3 className="h-3 w-3" /></button>
              <ConfirmDelete onConfirm={() => { remove(m.id); toast.success("تم الحذف"); }} />
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "تعديل" : "إضافة"} موقع</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="الاسم" className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
              <input value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} placeholder="النوع (قلعة، زاوية...)" className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="الوصف" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.0001" value={editing.lat ?? ""} onChange={(e) => setEditing({ ...editing, lat: parseFloat(e.target.value) })} placeholder="خط العرض" className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
                <input type="number" step="0.0001" value={editing.lng ?? ""} onChange={(e) => setEditing({ ...editing, lng: parseFloat(e.target.value) })} placeholder="خط الطول" className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => editing && save(editing)} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold">حفظ</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MapAdmin;
