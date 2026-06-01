import { fullStories } from "@/data/heritage";
import { Edit3, Trash2, Plus } from "lucide-react";

export default function AdminStories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>الحكايات</h1>
          <p className="text-sm text-white/55 mt-1">إدارة قصص وحكايات الجبل</p>
        </div>
        <button className="px-4 h-10 rounded-xl bg-[var(--gold)] text-black text-sm font-bold flex items-center gap-2">
          <Plus className="h-4 w-4" /> حكاية جديدة
        </button>
      </div>
      <div className="grid gap-3">
        {fullStories.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{s.title}</p>
              <p className="text-xs text-white/55 truncate">{s.subtitle}</p>
            </div>
            <button className="h-9 w-9 rounded-lg bg-white/5 grid place-items-center"><Edit3 className="h-4 w-4" /></button>
            <button className="h-9 w-9 rounded-lg bg-red-500/10 text-red-300 grid place-items-center"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
