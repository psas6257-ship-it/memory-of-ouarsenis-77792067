import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ArrowRight, ArrowLeft } from "lucide-react";

,
});

function Privacy() {
  const { t, i18n } = useTranslation();
  const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;
  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto safe-bottom">
        <header className="safe-top px-5 py-4 flex items-center gap-3 sticky top-0 glass-strong z-10">
          <Link to="/" aria-label={t("common.back")} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center"><BackIcon className="h-4 w-4" /></Link>
          <h1 className="text-lg font-bold">{t("privacy.title")}</h1>
        </header>
        <div className="px-6 py-6 text-sm text-white/75 leading-loose space-y-4">
          <p>{t("privacy.intro")}</p>
          <h3 className="font-bold text-[var(--gold)]">{t("privacy.dataHeading")}</h3>
          <p>{t("privacy.data")}</p>
          <h3 className="font-bold text-[var(--gold)]">{t("privacy.storageHeading")}</h3>
          <p>{t("privacy.storage")}</p>
          <h3 className="font-bold text-[var(--gold)]">{t("privacy.rightsHeading")}</h3>
          <p>{t("privacy.rights")}</p>
          <p className="text-xs text-white/50 mt-8">{t("privacy.updated")}</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default Privacy;
