import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

export function AppHeader({ title, greeting }: { title?: string; greeting?: string }) {
  return (
    <div className="safe-top px-5 pt-3 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg">
          <img src={logo} alt="ذاكرة الجبل" className="h-full w-full object-cover" />
        </div>
        <div>
          {greeting && <p className="text-[11px] text-white/50 leading-none mb-1">{greeting}</p>}
          <h1 className="text-base font-semibold tracking-tight">{title ?? "ذاكرة الجبل"}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/app/search" className="h-10 w-10 grid place-items-center rounded-2xl glass">
          <Search className="h-4.5 w-4.5 text-white/70" />
        </Link>
        <button className="h-10 w-10 grid place-items-center rounded-2xl glass relative">
          <Bell className="h-4.5 w-4.5 text-white/70" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--gold)] ring-2 ring-background" />
        </button>
      </div>
    </div>
  );
}
