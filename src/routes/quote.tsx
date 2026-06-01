import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { quotes } from "@/data/heritage";
import { useRef, useState } from "react";
import { ArrowRight, Download, Share2, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  { name: "ذهبي", bg: "linear-gradient(135deg, #2b1d12 0%, #5c3a1a 50%, #b8842c 100%)", accent: "#f5d089" },
  { name: "ليلي", bg: "linear-gradient(135deg, #0a0f1e 0%, #1a2340 50%, #354a8a 100%)", accent: "#a8c4ff" },
  { name: "ترابي", bg: "linear-gradient(135deg, #2d1810 0%, #5c2e1a 50%, #a04a2a 100%)", accent: "#f0b890" },
  { name: "صحراوي", bg: "linear-gradient(135deg, #1f1a14 0%, #4a3a28 50%, #c4a070 100%)", accent: "#fde8c0" },
];

function QuoteGen() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [theme, setTheme] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const current = quotes[idx];
  const t = themes[theme];

  const download = async () => {
    if (!cardRef.current) return;
    const w = 1080, h = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#2b1d12"); grad.addColorStop(1, "#b8842c");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = t.accent;
    ctx.font = "bold 56px Tajawal, system-ui";
    ctx.direction = "rtl"; ctx.textAlign = "center";
    const text = (typeof current === "string" ? current : (current as any).text) || "";
    const words = text.split(" ");
    let line = "", y = 480;
    for (const w2 of words) {
      const t2 = line + w2 + " ";
      if (ctx.measureText(t2).width > 900 && line) { ctx.fillText(line.trim(), w/2, y); line = w2 + " "; y += 80; }
      else line = t2;
    }
    ctx.fillText(line.trim(), w/2, y);
    ctx.font = "32px Tajawal"; ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("— ذاكرة الجبل —", w/2, h - 100);
    const link = document.createElement("a");
    link.download = `quote-${idx + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const share = async () => {
    const text = (typeof current === "string" ? current : (current as any).text) || "";
    if (navigator.share) {
      try { await navigator.share({ text: `${text}\n\n— ذاكرة الجبل` }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col bg-black">
        <div className="px-4 py-3 flex items-center justify-between glass-strong">
          <button onClick={() => navigate("/app")} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center">
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs font-semibold">بطاقات الاقتباس</p>
          <button onClick={() => setIdx((idx + 1) % quotes.length)} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center">
            <Shuffle className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 grid place-items-center p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${idx}-${theme}`}
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="aspect-square w-full max-w-sm rounded-3xl shadow-luxe relative overflow-hidden"
              style={{ background: t.bg }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="absolute inset-0 grain opacity-30" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <span className="text-5xl mb-4" style={{ color: t.accent, opacity: 0.4 }}>"</span>
                <p className="text-xl font-bold leading-relaxed text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {typeof current === "string" ? current : (current as any).text}
                </p>
                <div className="mt-8 pt-6 border-t w-20" style={{ borderColor: t.accent + "40" }} />
                <p className="text-[11px] mt-3 tracking-[0.3em]" style={{ color: t.accent }}>ذاكرة الجبل</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-6 pb-4 space-y-3">
          <div className="flex gap-2 justify-center">
            {themes.map((th, i) => (
              <button key={i} onClick={() => setTheme(i)} className={`h-10 w-10 rounded-full border-2 ${i === theme ? "border-white" : "border-white/20"}`} style={{ background: th.bg }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={download} className="flex-1 h-12 rounded-2xl bg-[var(--gold)] text-black font-semibold text-sm flex items-center justify-center gap-2">
              <Download className="h-4 w-4" /> تنزيل صورة
            </button>
            <button onClick={share} className="flex-1 h-12 rounded-2xl bg-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4" /> مشاركة
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default QuoteGen;
