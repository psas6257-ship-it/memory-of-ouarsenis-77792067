import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/PhoneFrame";
import { api } from "@/lib/api";
import { Lock, ArrowLeft, Loader2 } from "lucide-react";

const schema = z.object({
  password: z.string().min(6, "6 أحرف على الأقل").max(72),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, { path: ["confirm"], message: "كلمتا المرور غير متطابقتين" });

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) return setErr(parsed.error.issues[0].message);
    setBusy(true);
    try {
      const token = new URLSearchParams(location.search).get("token") || "demo";
      await api.resetPassword(token, password);
      toast.success("تم تحديث كلمة المرور");
      navigate("/login");
    } catch (e: any) { setErr(e.message || "خطأ"); } finally { setBusy(false); }
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col px-6 pt-12 pb-8">
        <Link to="/login" className="h-9 w-9 rounded-full glass-strong grid place-items-center">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold mt-10" style={{ fontFamily: "var(--font-display)" }}>كلمة مرور جديدة</h1>
        <p className="text-sm text-white/60 mt-2">اختر كلمة مرور قوية لحسابك.</p>
        <form onSubmit={submit} className="mt-10 space-y-4">
          <Field placeholder="كلمة المرور الجديدة" value={password} onChange={setPassword} />
          <Field placeholder="تأكيد كلمة المرور" value={confirm} onChange={setConfirm} />
          {err && <p className="text-xs text-red-400 text-center">{err}</p>}
          <button disabled={busy} className="w-full h-12 rounded-2xl bg-[var(--gold)] text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ"}
          </button>
        </form>
      </div>
    </PhoneFrame>
  );
}
function Field({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
      <input type="password" required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 pr-11 text-sm focus:outline-none focus:border-[var(--gold)]/50" />
    </div>
  );
}

export default ResetPage;
