import { notifications as seed } from "@/data/heritage";
import { Edit3, Plus, Bell, Send } from "lucide-react";
import { useState } from "react";
import { useLocalList } from "@/lib/use-local-list";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { toast } from "sonner";

type Row = { id?: any; title: string; body: string; type?: string; date?: string };

function NotifAdmin() {
  const { items, add, update, remove } = useLocalList<Row>("mom-admin-notif", seed as any);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const save = (r: Row) => {
    if (!r.title) return toast.error("العنوان مطلوب");
    if (r.id) update(r.id, r); else add({ ...r, date: new Date().toISOString().slice(0, 10) });
    toast.success("تم الحفظ"); setOpen(false);
  };
  const send = (r: Row) => toast.success(`تم إرسال: ${r.title}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>الإشعارات</h1>
          <p className="text-sm text-white/55 mt-1">{items.length} إشعاراً</p>
        </div>
        <button onClick={() => { setEditing({ title: "", body: "", type: "info" }); setOpen(true); }} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> إنشاء
        </button>
      </div>
      <div className="space-y-2">
        {items.map((n: Row, i) => (
          <div key={n.id ?? i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--gold)]/15 grid place-items-center shrink-0"><Bell className="h-4 w-4 text-[var(--gold)]" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{n.title}</p>
              <p className="text-[11px] text-white/55 mt-1 line-clamp-2">{n.body}</p>
              <p className="text-[10px] text-white/40 mt-1">{n.date}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => send(n)} title="إرسال" className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-300 grid place-items-center"><Send className="h-3.5 w-3.5" /></button>
              <button onClick={() => { setEditing(n); setOpen(true); }} className="h-8 w-8 rounded-lg bg-white/5 grid place-items-center"><Edit3 className="h-3.5 w-3.5" /></button>
              <ConfirmDelete onConfirm={() => { remove(n.id); toast.success("تم الحذف"); }} />
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "تعديل" : "إنشاء"} إشعار</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="العنوان" className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
              <textarea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} placeholder="نص الإشعار" rows={4} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" />
              <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm">
                <option value="info">معلومة</option>
                <option value="new">محتوى جديد</option>
                <option value="event">حدث</option>
              </select>
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

export default NotifAdmin;
