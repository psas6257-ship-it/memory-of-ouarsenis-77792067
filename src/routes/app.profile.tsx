import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { books } from "@/data/content";
import { Bookmark, Download, Heart, Settings, Globe, Bell, LogOut, ChevronLeft, Shield, Quote, Pencil, KeyRound } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

function Profile() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const stats = [
    { label: t("profile.favorites"), value: 12, icon: Heart },
    { label: t("profile.downloads"), value: 8, icon: Download },
    { label: t("profile.bookmarks"), value: 24, icon: Bookmark },
  ];

  const langName = i18n.language?.startsWith("fr") ? "Français" : i18n.language?.startsWith("en") ? "English" : "العربية";

  const items = [
    { icon: Bell, label: t("nav.profile") + " · " + t("settings.notifications"), v: "", to: "/app/notifications" as const },
    { icon: Globe, label: t("settings.language"), v: langName, to: "/app/settings" as const },
    { icon: Download, label: t("profile.downloads"), v: "256 م.ب", to: "/app/settings" as const },
    { icon: Settings, label: t("settings.title"), v: "", to: "/app/settings" as const },
  ];

  const onLogout = () => { logout(); navigate("/login"); };

  const saveProfile = () => {
    if (!name.trim()) return toast.error(t("profile.name"));
    updateProfile({ name: name.trim(), bio: bio.trim() });
    toast.success(t("profile.saved"));
    setEditOpen(false);
  };

  const savePassword = async () => {
    try {
      await changePassword(oldPw, newPw);
      toast.success(t("profile.saved"));
      setPwOpen(false); setOldPw(""); setNewPw("");
    } catch (e: any) {
      toast.error(e?.message || "Error");
    }
  };

  return (
    <div>
      <AppHeader title={t("profile.title")} greeting={t("profile.greeting")} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 mt-3">
        <div className="relative rounded-3xl overflow-hidden p-5 glass-strong shadow-luxe">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-30" style={{ background: "var(--gold)" }} />
          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl grid place-items-center text-xl font-bold overflow-hidden" style={{ background: "linear-gradient(135deg, var(--gold), var(--clay))" }}>
              {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : (user?.name?.[0] || "ز")}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold truncate">{user?.name || t("profile.guest")}</h2>
              <p className="text-xs text-white/55 truncate">{user?.email || t("profile.memberSince")}</p>
              {user?.bio && <p className="text-[11px] text-white/50 mt-1 line-clamp-2">{user.bio}</p>}
            </div>
            {user && (
              <button onClick={() => { setName(user.name); setBio(user.bio || ""); setEditOpen(true); }}
                className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center hover:bg-white/20" aria-label={t("profile.editProfile")}>
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="relative mt-5 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/5 p-3 text-center">
                <s.icon className="h-4 w-4 mx-auto text-[var(--gold)]" />
                <p className="text-lg font-bold mt-1">{s.value}</p>
                <p className="text-[10px] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <section className="mt-6 px-5">
        <h3 className="text-sm font-semibold mb-3">{t("profile.recent")}</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
          {books.slice(0, 3).map((b) => (
            <Link key={b.id} to={`/book/${b.id}`} className="shrink-0 w-28">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-luxe">
                <img src={b.cover} alt={b.title} className="h-full w-full object-cover" />
              </div>
              <p className="mt-1.5 text-[10px] line-clamp-2 leading-tight">{b.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5 pb-24">
        <div className="rounded-3xl glass overflow-hidden divide-y divide-white/5">
          {items.map((it) => (
            <Link key={it.label} to={it.to} className="w-full flex items-center justify-between p-4 hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/5 grid place-items-center">
                  <it.icon className="h-4 w-4 text-[var(--gold)]" />
                </div>
                <span className="text-sm">{it.label}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                {it.v}
                <ChevronLeft className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {user && (
          <button onClick={() => setPwOpen(true)} className="mt-3 w-full p-4 rounded-3xl glass flex items-center justify-center gap-2 text-sm text-white/80 hover:text-white">
            <KeyRound className="h-4 w-4" /> {t("profile.changePassword")}
          </button>
        )}

        <Link to="/quote" className="mt-3 w-full p-4 rounded-3xl glass flex items-center justify-center gap-2 text-sm text-[var(--gold)]">
          <Quote className="h-4 w-4" /> {t("profile.quoteCards")}
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="mt-3 w-full p-4 rounded-3xl bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center gap-2 text-sm text-[var(--gold)] font-semibold">
            <Shield className="h-4 w-4" /> {t("profile.adminPanel")}
          </Link>
        )}
        {user ? (
          <button onClick={onLogout} className="mt-3 w-full p-4 rounded-3xl glass flex items-center justify-center gap-2 text-sm text-red-300 hover:text-red-200">
            <LogOut className="h-4 w-4" /> {t("profile.logout")}
          </button>
        ) : (
          <Link to="/login" className="mt-3 w-full p-4 rounded-3xl bg-[var(--gold)] text-black flex items-center justify-center gap-2 text-sm font-semibold">
            تسجيل الدخول
          </Link>
        )}
      </section>

      {/* Edit profile dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("profile.editProfile")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("profile.name")}
              className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t("profile.bio")} rows={3}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          </div>
          <DialogFooter>
            <button onClick={() => setEditOpen(false)} className="h-10 px-4 rounded-xl bg-white/5 text-sm">{t("common.cancel")}</button>
            <button onClick={saveProfile} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold">{t("common.save")}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change password dialog */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("profile.changePassword")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder={t("profile.currentPassword")}
              className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder={t("profile.newPassword")}
              className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm" />
          </div>
          <DialogFooter>
            <button onClick={() => setPwOpen(false)} className="h-10 px-4 rounded-xl bg-white/5 text-sm">{t("common.cancel")}</button>
            <button onClick={savePassword} className="h-10 px-4 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold">{t("common.save")}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Profile;
