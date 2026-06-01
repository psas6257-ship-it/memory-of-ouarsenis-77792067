import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { videos } from "@/data/content";
import { Play } from "lucide-react";

const cats = ["الكل", "وثائقي", "حكايات", "موسيقى", "آثار", "حرف", "مباشر"];

function Media() {
  const [cat, setCat] = useState("الكل");
  const filtered = cat === "الكل" ? videos : videos.filter((v) => v.category === cat);

  return (
    <div>
      <AppHeader title="مكتبة الوسائط" greeting="شاهد واستمع" />
      <div className="px-5 mt-2 flex gap-2 overflow-x-auto no-scrollbar -mx-0">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              cat === c ? "bg-[var(--gold)] text-black" : "glass text-white/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured big card */}
      {filtered[0] && (
        <Link to={`/video/${filtered[0].id}`} className="block px-5 mt-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-luxe">
            <img src={filtered[0].thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-16 w-16 rounded-full glass-strong grid place-items-center ring-1 ring-white/20">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4">
              <span className="text-[10px] text-[var(--gold)] tracking-widest">★ المختار</span>
              <p className="text-base font-bold leading-tight mt-1">{filtered[0].title}</p>
            </div>
          </div>
        </Link>
      )}

      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        {filtered.slice(1).map((v, idx) => (
          <Link key={v.id} to={`/video/${v.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-luxe">
                <img src={v.thumbnail} alt={v.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-9 w-9 rounded-full glass-strong grid place-items-center">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-medium">
                  {v.duration}
                </div>
              </div>
              <p className="mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2">{v.title}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Media;
