import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { Moon, Sun, Languages, Type, Download, Bell, Shield, Info, ChevronLeft, Sparkles, RotateCcw, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { setLang as applyLang } from "@/i18n";
import { useSettings } from "@/lib/settings";
import { toast } from "sonner";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-[var(--gold)]" : "bg-white/15"}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md ${on ? "right-0.5" : "right-[calc(100%-1.375rem)]"}`}
      />
    </button>
  );
}

function Settings() {
  const { t, i18n } = useTranslation();
  const s = useSettings();
  const lang = (i18n.language || "ar").slice(0, 2) as "ar" | "fr" | "en";

  const changeLang = (l: "ar" | "fr" | "en") => {
    applyLang(l);
    toast.success(t("profile.saved"));
  };

  return (
    <div>
      <AppHeader title={t("settings.title")} greeting={t("settings.subtitle")} />
      <div className="px-5 mt-2 space-y-5 pb-24">
        <Section title={t("settings.appearance")}>
          <Row icon={s.theme === "dark" ? Moon : Sun} label={s.theme === "dark" ? t("settings.darkMode") : t("settings.lightMode")}>
            <Toggle on={s.theme === "dark"} onChange={() => { s.update("theme", s.theme === "dark" ? "light" : "dark"); toast.success(t("profile.saved")); }} />
          </Row>
          <Row icon={Type} label={`${t("settings.fontSize")}: ${s.fontSize}px`}>
            <input
              type="range" min={14} max={22} value={s.fontSize}
              onChange={(e) => s.update("fontSize", +e.target.value)}
              className="accent-[var(--gold)] w-32"
            />
          </Row>
          <Row icon={Sparkles} label={t("settings.reduceMotion")}>
            <Toggle on={s.reduceMotion} onChange={() => s.update("reduceMotion", !s.reduceMotion)} />
          </Row>
        </Section>

        <Section title={t("settings.language")}>
          <div className="grid grid-cols-3 gap-2 p-2">
            {(["ar", "fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                className={`h-10 rounded-xl text-xs transition-colors ${lang === l ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40" : "bg-card/40 text-white/60 border border-white/5 hover:bg-white/5"}`}
              >
                {l === "ar" ? "العربية" : l === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>
        </Section>

        <Section title={t("settings.reading")}>
          <Row icon={Download} label={t("settings.autoDownload")}>
            <Toggle on={s.autoDownload} onChange={() => s.update("autoDownload", !s.autoDownload)} />
          </Row>
          <Row icon={Bell} label={t("settings.notifications")}>
            <Toggle on={s.notifications} onChange={async () => {
              const next = !s.notifications;
              if (next && typeof Notification !== "undefined" && Notification.permission === "default") {
                try { await Notification.requestPermission(); } catch {}
              }
              s.update("notifications", next);
            }} />
          </Row>
        </Section>

        <Section title={t("settings.about")}>
          <LinkRow icon={Shield} label={t("settings.privacy")} to="/privacy" />
          <LinkRow icon={Users} label={t("settings.contributors")} to="/about" />
          <Row icon={Info} label={`${t("settings.version")} 1.0.0`} />
        </Section>

        <button
          onClick={() => { s.reset(); toast.success(t("settings.resetDone")); }}
          className="w-full p-4 rounded-3xl glass flex items-center justify-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" /> {t("settings.reset")}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-[var(--gold)] mb-2 px-1 uppercase tracking-widest">{title}</p>
      <div className="rounded-2xl glass divide-y divide-white/5">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: any; label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon className="h-4 w-4 text-white/70" />
      <span className="flex-1 text-sm">{label}</span>
      {children}
    </div>
  );
}

function LinkRow({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link to={to} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5">
      <Icon className="h-4 w-4 text-white/70" />
      <span className="flex-1 text-sm">{label}</span>
      <ChevronLeft className="h-4 w-4 text-white/40" />
    </Link>
  );
}

export default Settings;
