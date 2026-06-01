import { audioTracks } from "@/data/heritage";
import { Music, Edit3, Trash2, Plus } from "lucide-react";

export default function AdminMedia() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الوسائط والصوت</h1>
        <button className="px-4 h-10 rounded-xl bg-[var(--gold)] text-black text-sm font-bold flex items-center gap-2">
          <Plus className="h-4 w-4" /> إضافة مقطع
        </button>
      </div>
      <div className="grid gap-3">
        {audioTracks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="h-11 w-11 rounded-xl bg-[var(--gold)]/15 grid place-items-center">
              <Music className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{t.title}</p>
              <p className="text-xs text-white/55">{t.duration}</p>
            </div>
            <button className="h-9 w-9 rounded-lg bg-white/5 grid place-items-center"><Edit3 className="h-4 w-4" /></button>
            <button className="h-9 w-9 rounded-lg bg-red-500/10 text-red-300 grid place-items-center"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
