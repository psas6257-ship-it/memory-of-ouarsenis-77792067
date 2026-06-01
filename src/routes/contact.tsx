import { Link } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ArrowRight, ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(255),
  message: z.string().trim().min(10).max(1000),
});

function Contact() {
  const { t, i18n } = useTranslation();
  const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = schema.safeParse(form);
    if (!r.success) return setErr(r.error.issues[0].message);
    toast.success(t("contact.sent"));
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto safe-bottom">
        <header className="safe-top px-5 py-4 flex items-center gap-3 sticky top-0 glass-strong z-10">
          <Link to="/" aria-label={t("common.back")} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center"><BackIcon className="h-4 w-4" /></Link>
          <h1 className="text-lg font-bold">{t("contact.title")}</h1>
        </header>
        <div className="px-6 py-6 space-y-6">
          <div className="space-y-3">
            <Row icon={Mail} text="contact@univ.dz" />
            <Row icon={Phone} text="+213 27 00 00 00" />
            <Row icon={MapPin} text="تيسمسيلت، الجزائر" />
          </div>
          <form onSubmit={submit} className="space-y-3 pt-4 border-t border-white/10">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("contact.name")} aria-label={t("contact.name")} className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm" />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("contact.email")} aria-label={t("contact.email")} className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm" />
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("contact.message")} aria-label={t("contact.message")} rows={5} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm" />
            {err && <p className="text-xs text-red-400" role="alert">{err}</p>}
            <button className="w-full h-12 rounded-2xl bg-[var(--gold)] text-black font-bold text-sm flex items-center justify-center gap-2"><Send className="h-4 w-4" /> {t("contact.send")}</button>
          </form>
        </div>
      </div>
    </PhoneFrame>
  );
}
function Row({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="h-9 w-9 rounded-lg bg-[var(--gold)]/15 grid place-items-center"><Icon className="h-4 w-4 text-[var(--gold)]" /></div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

export default Contact;
