import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChevronLeft, ChevronRight } from "lucide-react";
import kasbah from "@/assets/heritage-kasbah.jpg";
import manuscript from "@/assets/heritage-manuscript.jpg";
import music from "@/assets/heritage-music.jpg";

function Onboarding() {
  const { t, i18n } = useTranslation();
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const isRtl = i18n.dir() === "rtl";

  const slides = [
    { image: kasbah, title: t("onboarding.slide1Title"), text: t("onboarding.slide1Text") },
    { image: manuscript, title: t("onboarding.slide2Title"), text: t("onboarding.slide2Text") },
    { image: music, title: t("onboarding.slide3Title"), text: t("onboarding.slide3Text") },
  ];

  const next = () => (i < slides.length - 1 ? setI(i + 1) : navigate("/login"));
  const Arrow = isRtl ? ChevronLeft : ChevronRight;

  return (
    <PhoneFrame>
      <div className="relative h-full flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img src={slides[i].image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-background" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mt-auto p-7 pb-10 safe-bottom">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gradient-gold" style={{ fontFamily: "var(--font-display)" }}>
                {slides[i].title}
              </h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-[28ch]">{slides[i].text}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {slides.map((_, k) => (
                <motion.div
                  key={k}
                  animate={{ width: k === i ? 24 : 6, opacity: k === i ? 1 : 0.4 }}
                  className="h-1.5 rounded-full bg-[var(--gold)]"
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label={t("common.next")}
              className="group relative h-14 w-14 rounded-full grid place-items-center shadow-luxe overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--gold), var(--clay))" }}
            >
              <Arrow className="h-6 w-6 text-black/80" strokeWidth={2.5} />
              <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default Onboarding;
