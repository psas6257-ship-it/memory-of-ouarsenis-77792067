import { figures } from "@/data/heritage";
import { Edit3, Trash2, Plus } from "lucide-react";

function FiguresAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>الأعلام التاريخية</h1>
          <p className="text-sm text-white/55 mt-1">{figures.length} علم</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {figures.map((f) => (
          <div key={f.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-3">
            <img src={f.portrait} className="h-16 w-16 rounded-xl object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">{f.name}</h3>
              <p className="text-[11px] text-white/55">{f.era}</p>
              <p className="text-[11px] text-white/50 mt-1 line-clamp-2">{f.title}</p>
              <div className="flex gap-1 mt-2">
                <button className="h-7 w-7 rounded-lg bg-white/5 grid place-items-center"><Edit3 className="h-3 w-3" /></button>
                <button className="h-7 w-7 rounded-lg bg-red-500/10 text-red-300 grid place-items-center"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FiguresAdmin;
