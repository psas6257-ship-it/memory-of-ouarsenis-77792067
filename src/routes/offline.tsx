import { Link } from "react-router-dom";
import { WifiOff, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

function OfflinePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background grid place-items-center px-6 text-center">
      <div className="max-w-sm space-y-5">
        <div className="mx-auto h-20 w-20 rounded-full bg-white/5 grid place-items-center">
          <WifiOff className="h-9 w-9 text-[var(--gold,#d4a64c)]" />
        </div>
        <h1 className="text-2xl font-bold">{t("offline.title")}</h1>
        <p className="text-sm text-white/60 leading-relaxed">{t("offline.body")}</p>
        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={() => location.reload()}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[var(--gold,#d4a64c)] text-black text-sm font-semibold"
          >
            <RefreshCw className="h-4 w-4" /> {t("common.retry")}
          </button>
          <Link to="/app" className="inline-flex items-center h-11 px-5 rounded-xl border border-white/15 text-sm">
            {t("nav.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OfflinePage;
