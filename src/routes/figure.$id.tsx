import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Award } from "lucide-react";
import { figures } from "@/data/heritage";
import { PhoneFrame } from "@/components/PhoneFrame";

function FigurePage() {
  const { id } = useParams() as any;
  const f = figures.find((x) => x.id === id);
  if (!f) return <PhoneFrame><div className="flex-1 grid place-items-center text-white/60">غير موجود</div></PhoneFrame>;

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="relative h-[50vh]">
          <img src={f.portrait} alt={f.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <Link to="/app/figures" className="absolute top-5 right-5 h-10 w-10 rounded-full glass-strong grid place-items-center">
            <ChevronRight className="h-5 w-5" />
          </Link>
          <div className="absolute bottom-0 inset-x-0 p-6">
            <p className="text-[10px] text-[var(--gold)] uppercase tracking-widest">{f.era}</p>
            <h1 className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{f.name}</h1>
            <p className="text-sm text-white/70 mt-1">{f.title} · {f.region}</p>
          </div>
        </div>

        <div className="px-6 pb-32 space-y-6 mt-6">
          {f.quote && (
            <motion.blockquote initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 rounded-2xl bg-card/40 border-r-2 border-[var(--gold)] italic text-lg leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
              "{f.quote}"
            </motion.blockquote>
          )}

          <section>
            <h2 className="text-sm text-[var(--gold)] mb-3">السيرة</h2>
            <div className="space-y-3 text-[15px] leading-[2] text-white/85">
              {f.bio.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>

          <section>
            <h2 className="text-sm text-[var(--gold)] mb-3">إنجازات بارزة</h2>
            <ul className="space-y-2">
              {f.achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card/40">
                  <Award className="h-4 w-4 text-[var(--gold)] mt-0.5 shrink-0" />
                  <span className="text-sm text-white/85">{a}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default FigurePage;
