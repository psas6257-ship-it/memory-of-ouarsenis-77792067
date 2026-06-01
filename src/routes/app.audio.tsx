import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { audioTracks, type AudioTrack } from "@/data/heritage";
import { Play, Pause, X, SkipBack, SkipForward, Heart } from "lucide-react";
import { useState } from "react";

function Audio() {
  const [current, setCurrent] = useState<AudioTrack | null>(null);
  const [playing, setPlaying] = useState(false);

  const open = (t: AudioTrack) => {
    setCurrent(t);
    setPlaying(true);
  };

  return (
    <div>
      <AppHeader title="مكتبة الصوت" greeting="أصوات من ذاكرة الجبل" />
      <div className="px-5 mt-2 space-y-3 pb-32">
        {audioTracks.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => open(t)}
            className="w-full text-right flex items-center gap-3 p-3 rounded-2xl glass"
          >
            <img src={t.cover} alt="" className="h-14 w-14 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[var(--gold)]">{t.category}</p>
              <p className="text-sm font-medium truncate">{t.title}</p>
              <p className="text-[11px] text-white/50 truncate">{t.artist} · {t.duration}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--gold)]/20 grid place-items-center">
              <Play className="h-4 w-4 text-[var(--gold)]" fill="currentColor" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Mini Player */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 30 }}
            className="absolute bottom-24 inset-x-3 z-40 rounded-2xl glass-strong shadow-luxe overflow-hidden"
          >
            <div className="p-3 flex items-center gap-3">
              <img src={current.cover} alt="" className="h-11 w-11 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{current.title}</p>
                <p className="text-[10px] text-white/50 truncate">{current.artist}</p>
              </div>
              <button onClick={() => setPlaying(!playing)} className="h-10 w-10 rounded-full bg-[var(--gold)] grid place-items-center">
                {playing ? <Pause className="h-4 w-4 text-background" fill="currentColor" /> : <Play className="h-4 w-4 text-background" fill="currentColor" />}
              </button>
              <button onClick={() => { setCurrent(null); setPlaying(false); }} className="h-8 w-8 grid place-items-center text-white/50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-0.5 bg-white/10">
              <motion.div
                key={current.id + String(playing)}
                initial={{ width: "0%" }}
                animate={{ width: playing ? "100%" : "0%" }}
                transition={{ duration: 30, ease: "linear" }}
                className="h-full bg-[var(--gold)]"
              />
            </div>
            {/* Hidden YouTube audio iframe */}
            {current.youtubeId && playing && (
              <iframe
                title="audio"
                width="0"
                height="0"
                style={{ display: "none" }}
                src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&controls=0`}
                allow="autoplay"
              />
            )}
            <div className="flex items-center justify-around py-2 border-t border-white/5">
              <button className="text-white/50"><SkipForward className="h-4 w-4" /></button>
              <button className="text-white/50"><Heart className="h-4 w-4" /></button>
              <button className="text-white/50"><SkipBack className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Audio;
