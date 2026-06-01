import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { books } from "@/data/content";
import { Filter } from "lucide-react";

const categories = ["الكل", "تاريخ", "أدب شعبي", "تراث لامادي", "آثار"];

function Library() {
  const [cat, setCat] = useState("الكل");
  const filtered = cat === "الكل" ? books : books.filter((b) => b.category === cat);

  return (
    <div>
      <AppHeader title="المكتبة الرقمية" greeting="استكشف" />
      <div className="px-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] text-white/50">{filtered.length} كتاب متاح</p>
          <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-xl glass text-xs">
            <Filter className="h-3.5 w-3.5" /> تصفية
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                cat === c
                  ? "bg-[var(--gold)] text-black"
                  : "glass text-white/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {filtered.map((b, idx) => (
          <Link key={b.id} to={`/book/${b.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-luxe ring-1 ring-white/5">
                <img src={b.cover} alt={b.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md glass text-[9px] font-medium">
                  {b.pages} ص
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{b.title}</p>
              <p className="text-[10px] text-white/45 mt-0.5">{b.category} • {b.year}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Library;
