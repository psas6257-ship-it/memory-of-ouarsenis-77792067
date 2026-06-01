import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useAuth } from "@/lib/auth";
import { Mail, Lock, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const u = await login(email.trim(), password);
      navigate({ to: u.role === "admin" ? "/admin" : "/app" });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col px-6 pt-12 pb-8 bg-gradient-to-b from-[oklch(0.18_0.02_50)] to-[oklch(0.13_0.018_45)]">
        <Link to="/" aria-label={t("common.back")} className="h-9 w-9 rounded-full glass-strong grid place-items-center">
          <BackIcon className="h-4 w-4" />
        </Link>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {t("auth.loginTitle")}
          </h1>
          <p className="text-sm text-white/60 mt-2">{t("auth.loginSubtitle")}</p>
        </motion.div>

        <form onSubmit={submit} className="mt-10 space-y-4">
          <Field icon={Mail} placeholder={t("auth.email")} type="email" value={email} onChange={setEmail} />
          <Field icon={Lock} placeholder={t("auth.password")} type="password" value={password} onChange={setPassword} />
          {err && <p className="text-xs text-red-400 text-center" role="alert">{err}</p>}
          <button
            disabled={busy}
            className="w-full h-12 rounded-2xl bg-[var(--gold)] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-luxe disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.signIn")}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-xs">
          <Link to="/forgot-password" className="text-white/60 hover:text-[var(--gold)]">{t("auth.forgot")}</Link>
          <Link to="/register" className="text-[var(--gold)] font-semibold">{t("auth.signUp")}</Link>
        </div>

        <div className="mt-auto pt-8 text-center">
          <p className="text-[10px] text-white/35">{t("auth.demoAdmin")}</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Field({
  icon: Icon, placeholder, type, value, onChange,
}: { icon: any; placeholder: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Icon className="absolute end-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 pe-11 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--gold)]/50"
      />
    </div>
  );
}

export default LoginPage;
