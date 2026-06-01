import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { figures } from "@/data/heritage";
import { ChevronLeft } from "lucide-react";

function Figures() {
  return (
    <div>
      <AppHeader title="أعلام المنطقة" greeting="وجوه صنعت ذاكرتنا" />
      <div className="px-5 mt-2 space-y-4">
        {figures.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={`/figure/${f.id}`} className="block">
              <div className="rounded-3xl overflow-hidden glass-strong shadow-luxe">
                <div className="flex gap-4 p-4">
                  <img src={f.portrait} alt={f.name} loading="lazy" className="h-24 w-24 rounded-2xl object-cover ring-1 ring-[var(--gold)]/30" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[var(--gold)] uppercase tracking-widest">{f.era}</p>
                    <h3 className="mt-1 text-lg font-bold truncate" style={{ fontFamily: "var(--font-display)" }}>{f.name}</h3>
                    <p className="text-xs text-white/60 mt-0.5">{f.title} · {f.region}</p>
                    <div className="mt-2 flex items-center text-[11px] text-[var(--gold)]">
                      عرض السيرة <ChevronLeft className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Figures;
