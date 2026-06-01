import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PhoneFrame } from "@/components/PhoneFrame";
import { api } from "@/lib/api";
import { Mail, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

function ForgotPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const ok = z.string().email().safeParse(email);
    if (!ok.success) return setErr(t("auth.invalidEmail"));
    setBusy(true);
    try { await api.forgotPassword(email); setSent(true); toast.success(t("auth.resetLinkSent")); }
    catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col px-6 pt-12 pb-8">
        <Link to="/login" aria-label={t("common.back")} className="h-9 w-9 rounded-full glass-strong grid place-items-center">
          <BackIcon className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold mt-10" style={{ fontFamily: "var(--font-display)" }}>{t("auth.forgotTitle")}</h1>
        <p className="text-sm text-white/60 mt-2">{t("auth.forgotSubtitle")}</p>
        {sent ? (
          <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-sm">{t("auth.checkEmail")}</p>
            <Link to="/reset-password" className="inline-block mt-4 text-[var(--gold)] text-sm font-semibold">{t("common.continue")}</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-4">
            <div className="relative">
              <Mail className="absolute end-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.email")} aria-label={t("auth.email")}
                className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 pe-11 text-sm focus:outline-none focus:border-[var(--gold)]/50" />
            </div>
            {err && <p className="text-xs text-red-400 text-center" role="alert">{err}</p>}
            <button disabled={busy} className="w-full h-12 rounded-2xl bg-[var(--gold)] text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.send")}
            </button>
          </form>
        )}
      </div>
    </PhoneFrame>
  );
}

export default ForgotPage;
