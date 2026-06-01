import { dictionary } from "@/data/heritage";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

function TransAdmin() {
  const [q, setQ] = useState("");
  const list = dictionary.filter((d) => d.word.includes(q) || d.meaning.includes(q));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>القاموس والترجمات</h1>
          <p className="text-sm text-white/55 mt-1">{dictionary.length} مفردة</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </div>
      <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-white/5 border border-white/10 max-w-md">
        <Search className="h-4 w-4 text-white/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث..." className="bg-transparent text-sm flex-1 outline-none" />
      </div>
      <div className="rounded-2xl border border-white/10 divide-y divide-white/5">
        {list.map((d, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
            <div>
              <p className="font-bold text-sm">{d.word}</p>
              <p className="text-[11px] text-white/55 mt-0.5">{d.meaning}</p>
            </div>
            <div className="flex gap-1.5">
              <button className="h-8 w-8 rounded-lg bg-white/5 grid place-items-center"><Edit3 className="h-3.5 w-3.5" /></button>
              <button className="h-8 w-8 rounded-lg bg-red-500/10 text-red-300 grid place-items-center"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransAdmin;
