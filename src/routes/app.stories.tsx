import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { fullStories } from "@/data/heritage";
import { Clock } from "lucide-react";

function Stories() {
  return (
    <div>
      <AppHeader title="حكايات الجبل" greeting="استمع وتذكّر" />
      <div className="px-5 mt-2 space-y-4">
        {fullStories.map((s, idx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden shadow-luxe ring-1 ring-white/5"
          >
            <div className="relative h-52">
              <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5">
              <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-strong text-[10px] text-[var(--gold)]">
                    <Clock className="h-3 w-3" /> {s.readTime}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[var(--gold)]/15 text-[10px] text-[var(--gold)]">{s.category}</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {s.title}
                </h3>
              </div>
            </div>
            <div className="p-5 bg-card/40">
              <p className="text-sm text-white/70 leading-relaxed line-clamp-2">{s.subtitle}</p>
              <Link to={`/story/${s.id}`} className="mt-4 inline-block text-xs text-[var(--gold)] font-medium">
                اقرأ القصة كاملة →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Stories;
