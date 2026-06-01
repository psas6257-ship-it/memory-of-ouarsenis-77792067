import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { mapLocations, type MapLocation } from "@/data/heritage";
import { MapPin, X } from "lucide-react";
import { useState } from "react";
import mountain from "@/assets/mountain-hero.jpg";

function MapScreen() {
  const [sel, setSel] = useState<MapLocation | null>(null);

  return (
    <div>
      <AppHeader title="خريطة التراث" greeting="استكشف مواقع الونشريس" />
      <div className="px-5 mt-2">
        <div className="relative rounded-3xl overflow-hidden shadow-luxe ring-1 ring-white/5 aspect-[3/4]">
          <img src={mountain} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/30 to-background/70" />
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />

          {mapLocations.map((l, i) => (
            <motion.button
              key={l.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300 }}
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              onClick={() => setSel(l)}
            >
              <span className="absolute inset-0 -m-2 rounded-full bg-[var(--gold)]/30 animate-ping" />
              <span className="relative h-8 w-8 rounded-full bg-[var(--gold)] grid place-items-center shadow-luxe ring-2 ring-background">
                <MapPin className="h-4 w-4 text-background" />
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-5">
          <p className="text-xs text-white/50 mb-3">{mapLocations.length} موقعًا تراثيًا</p>
          <div className="grid grid-cols-2 gap-3">
            {mapLocations.map((l) => (
              <button key={l.id} onClick={() => setSel(l)} className="text-right p-3 rounded-2xl glass">
                <span className="text-[10px] text-[var(--gold)]">{l.type}</span>
                <p className="mt-1 text-sm font-medium truncate">{l.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md grid place-items-end sm:place-items-center"
            onClick={() => setSel(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-white/10 overflow-hidden"
            >
              <div className="relative h-44">
                <img src={sel.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <button onClick={() => setSel(null)} className="absolute top-3 left-3 h-9 w-9 rounded-full glass-strong grid place-items-center">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <span className="text-[10px] text-[var(--gold)] uppercase tracking-widest">{sel.type}</span>
                <h3 className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{sel.name}</h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">{sel.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MapScreen;
