import { books as seed, type Book } from "@/data/content";
import { Search, Plus, Edit3, Trash2, Download, ExternalLink, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useLocalList } from "@/lib/use-local-list";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

type Row = Book & { id: string };

function BooksAdmin() {
  const [q, setQ] = useState("");
  const { items, add, update, remove } = useLocalList<Row>("mom-admin-books", seed as any);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((b) => b.title.includes(q) || b.category.includes(q));

  const blank = (): Row => ({ id: `b-${Date.now()}`, title: "", author: "", cover: "", pdf: "", pages: 0, category: "", year: "", description: "" });

  const readFile = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const save = () => {
    if (!editing) return;
    if (!editing.title || !editing.category) return toast.error("العنوان والتصنيف مطلوبان");
    const exists = items.some((x) => x.id === editing.id);
    if (exists) update(editing.id, editing); else add(editing);
    toast.success("تم الحفظ"); setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>الكتب والمخطوطات</h1>
          <p className="text-sm text-white/55 mt-1">{items.length} عنصراً في المكتبة</p>
        </div>
        <button onClick={() => { setEditing(blank()); setOpen(true); }} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold flex items-center gap-2 w-fit">
          <Plus className="h-4 w-4" /> إضافة كتاب
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-white/5 border border-white/10 max-w-md">
        <Search className="h-4 w-4 text-white/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالعنوان أو التصنيف..." className="bg-transparent text-sm flex-1 outline-none placeholder:text-white/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div key={b.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-4">
            {b.cover && <img src={b.cover} alt="" className="h-24 w-20 rounded-xl object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[var(--gold)]">{b.category} · {b.year}</p>
              <h3 className="font-bold text-sm mt-0.5 line-clamp-2">{b.title}</h3>
              <p className="text-[11px] text-white/55 mt-1">{b.author}</p>
              <p className="text-[10px] text-white/40 mt-1">{b.pages} صفحة</p>
              <div className="flex gap-1.5 mt-3">
                <button onClick={() => { setEditing(b); setOpen(true); }} className="h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> تعديل
                </button>
                {b.pdf && (
                  <a href={b.pdf} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 grid place-items-center">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {b.pdf && (
                  <a href={b.pdf} download className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 grid place-items-center">
                    <Download className="h-3 w-3" />
                  </a>
                )}
                <button onClick={() => { remove(b.id); toast.success("تم الحذف"); }} className="h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 grid place-items-center">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing && items.some(x => x.id === editing.id) ? "تعديل" : "إضافة"} كتاب</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="العنوان" className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
                <input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} placeholder="المؤلف" className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
                <input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="التصنيف" className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
                <input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="السنة" className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
                <input type="number" value={editing.pages || ""} onChange={(e) => setEditing({ ...editing, pages: +e.target.value })} placeholder="عدد الصفحات" className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
              </div>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="الوصف" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input ref={imgRef} type="file" accept="image/*" hidden onChange={async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    setEditing({ ...editing, cover: await readFile(f) }); toast.success("تم رفع الغلاف");
                  }} />
                  <button type="button" onClick={() => imgRef.current?.click()} className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center justify-center gap-2">
                    <Upload className="h-3.5 w-3.5" /> رفع الغلاف
                  </button>
                  {editing.cover && <img src={editing.cover} alt="" className="mt-2 h-20 w-16 object-cover rounded" />}
                </div>
                <div>
                  <input ref={pdfRef} type="file" accept="application/pdf" hidden onChange={async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    setEditing({ ...editing, pdf: await readFile(f) }); toast.success(`تم رفع ${f.name}`);
                  }} />
                  <button type="button" onClick={() => pdfRef.current?.click()} className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center justify-center gap-2">
                    <Upload className="h-3.5 w-3.5" /> رفع PDF
                  </button>
                  {editing.pdf && <p className="mt-2 text-[10px] text-white/60">✓ تم الرفع</p>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={save} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold">حفظ</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BooksAdmin;
