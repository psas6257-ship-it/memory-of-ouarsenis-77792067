import { Link, useLocation } from "react-router-dom";
import { Home, Library, BookOpen, Film, User } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = useLocation().pathname;
  const tabs = [
    { to: "/app", label: t("nav.home"), icon: Home, exact: true },
    { to: "/app/library", label: t("nav.library"), icon: Library },
    { to: "/app/stories", label: t("nav.stories"), icon: BookOpen },
    { to: "/app/media", label: t("nav.media"), icon: Film },
    { to: "/app/profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <div className="absolute bottom-0 inset-x-0 z-40 safe-bottom px-3 pb-2 pt-2 pointer-events-none">
      <nav className="glass-strong shadow-luxe rounded-3xl flex items-center justify-between px-2 py-2 pointer-events-auto">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 gap-1 rounded-2xl"
            >
              {active && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(180deg, oklch(0.78 0.13 75 / 0.18), oklch(0.78 0.13 75 / 0.05))", border: "1px solid oklch(0.78 0.13 75 / 0.25)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`relative h-5 w-5 transition-colors ${active ? "text-[var(--gold)]" : "text-white/55"}`} strokeWidth={active ? 2.3 : 1.8} />
              <span className={`relative text-[10px] font-medium ${active ? "text-[var(--gold)]" : "text-white/55"}`}>
                {t.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
