import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { timeline } from "@/data/heritage";

function Timeline() {
  return (
    <div>
      <AppHeader title="الخط الزمني" greeting="رحلة في عمق التاريخ" />
      <div className="px-5 mt-2 relative">
        <div className="absolute right-9 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--gold)]/40 via-[var(--gold)]/15 to-transparent" />
        <div className="space-y-5">
          {timeline.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pr-16"
            >
              <div className="absolute right-6 top-3 h-6 w-6 rounded-full bg-background border-2 border-[var(--gold)] grid place-items-center">
                <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
              </div>
              <div className="rounded-2xl glass p-4 shadow-luxe">
                <p className="text-[10px] text-[var(--gold)] uppercase tracking-widest">{t.era}</p>
                <p className="mt-1 text-xs text-white/60">{t.year}</p>
                <h3 className="mt-2 text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{t.title}</h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">{t.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
