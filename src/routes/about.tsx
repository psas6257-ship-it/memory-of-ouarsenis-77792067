import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ArrowRight, ArrowLeft, Mountain } from "lucide-react";

function About() {
  const { t, i18n } = useTranslation();
  const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;
  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto safe-bottom">
        <header className="safe-top px-5 py-4 flex items-center gap-3 sticky top-0 glass-strong z-10">
          <Link to="/" aria-label={t("common.back")} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center"><BackIcon className="h-4 w-4" /></Link>
          <h1 className="text-lg font-bold">{t("about.title")}</h1>
        </header>
        <div className="px-6 pb-10">
          <div className="my-8 flex items-center justify-center">
            <div className="h-20 w-20 rounded-3xl grid place-items-center" style={{ background: "linear-gradient(135deg, var(--gold), var(--clay))" }}>
              <Mountain className="h-10 w-10 text-black/70" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gradient-gold" style={{ fontFamily: "var(--font-display)" }}>ذاكرة الجبل</h2>
          <p className="text-sm text-white/70 leading-loose mt-6">{t("about.intro")}</p>
          <h3 className="text-sm font-bold mt-8 text-[var(--gold)]">{t("about.visionHeading")}</h3>
          <p className="text-sm text-white/70 leading-loose mt-2">{t("about.vision")}</p>
          <h3 className="text-sm font-bold mt-8 text-[var(--gold)]">{t("about.teamHeading")}</h3>
          <p className="text-sm text-white/70 leading-loose mt-2">{t("about.team")}</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default About;
