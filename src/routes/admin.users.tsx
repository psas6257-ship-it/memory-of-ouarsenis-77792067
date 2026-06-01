import { useEffect, useState } from "react";
import { Shield, User, Trash2 } from "lucide-react";

function UsersAdmin() {
  const [users, setUsers] = useState<Array<{ name: string; email: string }>>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mom-users-v1");
      setUsers(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  const remove = (email: string) => {
    const next = users.filter((u) => u.email !== email);
    setUsers(next);
    localStorage.setItem("mom-users-v1", JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>المستخدمون والأدوار</h1>
        <p className="text-sm text-white/55 mt-1">إدارة حسابات المستخدمين المسجّلين</p>
      </div>
      <div className="rounded-2xl border border-white/10 divide-y divide-white/5">
        <div className="p-4 flex items-center justify-between bg-[var(--gold)]/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--gold)]/20 grid place-items-center"><Shield className="h-4 w-4 text-[var(--gold)]" /></div>
            <div>
              <p className="font-semibold text-sm">المشرف العام</p>
              <p className="text-[11px] text-white/55">admin@univ.dz</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-md bg-[var(--gold)]/20 text-[var(--gold)] font-semibold">ADMIN</span>
        </div>
        {users.length === 0 && <div className="p-8 text-center text-sm text-white/40">لا يوجد مستخدمون مسجّلون بعد</div>}
        {users.map((u) => (
          <div key={u.email} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/5 grid place-items-center"><User className="h-4 w-4" /></div>
              <div>
                <p className="font-semibold text-sm">{u.name}</p>
                <p className="text-[11px] text-white/55">{u.email}</p>
              </div>
            </div>
            <button onClick={() => remove(u.email)} className="h-8 w-8 rounded-lg bg-red-500/10 text-red-300 grid place-items-center"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersAdmin;
