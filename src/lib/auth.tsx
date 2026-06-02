import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  bio?: string;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "name" | "avatar" | "bio">>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

async function hydrate(userId: string, email: string | null): Promise<User | null> {
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("name, avatar_url, bio").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  const role = (roles || []).some((r: any) => r.role === "admin") ? "admin" : "user";
  return {
    id: userId,
    email: email || "",
    name: profile?.name || (email || "").split("@")[0],
    avatar: profile?.avatar_url || undefined,
    bio: profile?.bio || undefined,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (uid: string, email: string | null) => {
    const u = await hydrate(uid, email);
    setUser(u);
  };

  useEffect(() => {
    // Subscribe FIRST, then read existing session (Supabase best practice)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // defer to avoid deadlock with supabase client
        setTimeout(() => load(session.user.id, session.user.email ?? null), 0);
      } else {
        setUser(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) load(session.user.id, session.user.email ?? null).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(translateAuthError(error.message));
    if (!data.user) throw new Error("فشل تسجيل الدخول");
    const u = await hydrate(data.user.id, data.user.email ?? null);
    if (!u) throw new Error("تعذّر تحميل الملف الشخصي");
    setUser(u);
    return u;
  };

  const register: AuthCtx["register"] = async (name, email, password) => {
    const redirectTo = `${window.location.origin}/app`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo, data: { name } },
    });
    if (error) throw new Error(translateAuthError(error.message));
    if (!data.user) throw new Error("تعذّر إنشاء الحساب");
    // profile is auto-created by DB trigger; hydrate
    const u = await hydrate(data.user.id, data.user.email ?? null);
    if (u) setUser(u);
    return u || { id: data.user.id, email, name, role: "user" };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile: AuthCtx["updateProfile"] = async (patch) => {
    if (!user) throw new Error("غير مسجّل");
    const payload: any = {};
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.avatar !== undefined) payload.avatar_url = patch.avatar;
    if (patch.bio !== undefined) payload.bio = patch.bio;
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    if (error) throw new Error(error.message);
    setUser({ ...user, ...patch });
  };

  const changePassword: AuthCtx["changePassword"] = async (oldPassword, newPassword) => {
    if (!user) throw new Error("غير مسجّل");
    if (newPassword.length < 6) throw new Error("كلمة المرور قصيرة جداً (6 على الأقل)");
    // Re-verify old password
    const { error: signErr } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword });
    if (signErr) throw new Error("كلمة المرور الحالية غير صحيحة");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  };

  const refresh = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) await load(data.user.id, data.user.email ?? null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

function translateAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "بيانات الدخول غير صحيحة";
  if (m.includes("already registered") || m.includes("user already")) return "البريد مسجّل سابقاً";
  if (m.includes("password") && m.includes("short")) return "كلمة المرور قصيرة جداً";
  if (m.includes("email not confirmed")) return "الرجاء تأكيد البريد الإلكتروني أولاً";
  if (m.includes("rate limit")) return "محاولات كثيرة، حاول لاحقاً";
  return msg;
}
