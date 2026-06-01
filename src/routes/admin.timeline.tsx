import { timeline as seed } from "@/data/heritage";
import { Edit3, Plus } from "lucide-react";
import { useState } from "react";
import { useLocalList } from "@/lib/use-local-list";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { toast } from "sonner";

type Row = { id?: any; year: string; title: string; description: string };

function TimelineAdmin() {
  const { items, add, update, remove } = useLocalList<Row>("mom-admin-timeline", seed as any);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const startEdit = (r: Row) => { setEditing(r); setOpen(true); };
  const startAdd = () => { setEditing({ year: "", title: "", description: "" }); setOpen(true); };
  const save = (r: Row) => {
    if (!r.year || !r.title) return toast.error("الحقول مطلوبة");
    if (r.id) update(r.id, r); else add(r);
    toast.success("تم الحفظ"); setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>الخط الزمني</h1>
          <p className="text-sm text-white/55 mt-1">{items.length} حدثاً تاريخياً</p>
        </div>
        <button onClick={startAdd} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </div>
      <div className="rounded-2xl border border-white/10 divide-y divide-white/5">
        {items.map((t: Row, i) => (
          <div key={t.id ?? i} className="p-4 flex items-start justify-between gap-4 hover:bg-white/[0.02]">
            <div className="flex-1">
              <p className="text-xs text-[var(--gold)] font-semibold">{t.year}</p>
              <p className="font-semibold text-sm mt-0.5">{t.title}</p>
              <p className="text-[11px] text-white/55 mt-1 line-clamp-2">{t.description}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => startEdit(t)} className="h-8 w-8 rounded-lg bg-white/5 grid place-items-center"><Edit3 className="h-3.5 w-3.5" /></button>
              <ConfirmDelete onConfirm={() => { remove(t.id); toast.success("تم الحذف"); }} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "تعديل" : "إضافة"} حدث</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="السنة" className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="العنوان" className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="الوصف" rows={4} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" />
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

export default TimelineAdmin;
