import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, BookOpen, Feather, Map, Clock, Users, Headphones,
  Film, Bell, Globe, Settings, LogOut, Menu, X, Search,
} from "lucide-react";
import { useState } from "react";

      } catch (e: any) {
        if (e?.isRedirect) throw e;
      }
    }
  },
});

const nav = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { to: "/admin/books", label: "الكتب والمخطوطات", icon: BookOpen },
  { to: "/admin/stories", label: "الحكايات", icon: Feather },
  { to: "/admin/figures", label: "الأعلام", icon: Users },
  { to: "/admin/map", label: "الخريطة التراثية", icon: Map },
  { to: "/admin/timeline", label: "الخط الزمني", icon: Clock },
  { to: "/admin/media", label: "الوسائط والصوت", icon: Headphones },
  { to: "/admin/videos", label: "الفيديوهات", icon: Film },
  { to: "/admin/notifications", label: "الإشعارات", icon: Bell },
  { to: "/admin/translations", label: "الترجمات", icon: Globe },
  { to: "/admin/users", label: "المستخدمون", icon: Users },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [open, setOpen] = useState(false);

  const onLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-[oklch(0.14_0.015_50)] text-white" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-72 bg-[oklch(0.18_0.02_55)] border-l border-white/10 transform transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[var(--gold)]">ADMIN</p>
            <h1 className="text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>ذاكرة الجبل</h1>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden h-8 w-8 grid place-items-center rounded-lg bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/25"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300/80 hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:mr-72">
        <header className="h-16 sticky top-0 z-30 bg-[oklch(0.16_0.018_50)]/85 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden h-9 w-9 grid place-items-center rounded-lg bg-white/5">
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-xl bg-white/5 border border-white/10 w-80">
              <Search className="h-4 w-4 text-white/40" />
              <input placeholder="بحث سريع..." className="bg-transparent text-sm flex-1 outline-none placeholder:text-white/40" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app" className="text-xs px-3 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center hover:bg-white/10">
              معاينة التطبيق
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--clay)] grid place-items-center text-xs font-bold text-black">
                {user?.name?.[0] || "م"}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold leading-tight">{user?.name}</p>
                <p className="text-[10px] text-white/50">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden" />}
    </div>
  );
}

export default AdminLayout;
