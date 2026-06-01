export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">إعدادات المنصة</h1>
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
        <Field label="اسم التطبيق" defaultValue="ذاكرة الجبل" />
        <Field label="الوصف" defaultValue="تراث الونشريس" />
        <Field label="رابط API" defaultValue="/api" />
      </div>
      <button className="px-6 h-11 rounded-xl bg-[var(--gold)] text-black font-bold">حفظ التغييرات</button>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-xs text-white/60">{label}</span>
      <input defaultValue={defaultValue} className="mt-1 w-full h-11 rounded-xl bg-black/30 border border-white/10 px-3 text-sm outline-none focus:border-[var(--gold)]/50" />
    </label>
  );
}
