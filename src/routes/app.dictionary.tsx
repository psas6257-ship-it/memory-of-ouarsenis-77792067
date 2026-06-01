import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { dictionary } from "@/data/heritage";
import { Search, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";

const cats = ["الكل", "لباس", "طعام", "أدوات", "أمكنة", "حالات", "حرف"] as const;

function Dict() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("الكل");

  const filtered = useMemo(
    () =>
      dictionary.filter(
        (d) =>
          (cat === "الكل" || d.category === cat) &&
          (q === "" || d.word.includes(q) || d.meaning.includes(q)),
      ),
    [q, cat],
  );

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div>
      <AppHeader title="القاموس التراثي" greeting="مفردات من ذاكرة الجبل" />
      <div className="px-5 mt-2">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن كلمة أو معنى..."
            className="w-full h-12 rounded-2xl bg-card/60 border border-white/5 pr-11 pl-4 text-sm focus:outline-none focus:border-[var(--gold)]/40"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 px-4 h-9 rounded-full text-xs transition-all ${
                cat === c ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40" : "bg-card/40 text-white/60 border border-white/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((d, i) => (
            <motion.div
              key={d.word}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="p-4 rounded-2xl glass border border-white/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[var(--gold)]" style={{ fontFamily: "var(--font-display)" }}>{d.word}</h3>
                  {d.pronunciation && <p className="text-[11px] text-white/50 mt-0.5">[{d.pronunciation}]</p>}
                </div>
                <button onClick={() => speak(d.word + ". " + d.meaning)} className="h-9 w-9 rounded-full bg-[var(--gold)]/15 grid place-items-center">
                  <Volume2 className="h-4 w-4 text-[var(--gold)]" />
                </button>
              </div>
              <p className="mt-2 text-sm text-white/80 leading-relaxed">{d.meaning}</p>
              {d.example && <p className="mt-2 text-xs text-white/50 italic">مثال: {d.example}</p>}
              <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60">{d.category}</span>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="text-center text-white/40 py-10 text-sm">لا توجد نتائج</p>}
        </div>
      </div>
    </div>
  );
}

export default Dict;
