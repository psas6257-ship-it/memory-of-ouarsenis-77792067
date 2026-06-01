import { ReactNode } from "react";

function SimpleAdmin({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
        <p className="text-sm text-white/55 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

import { fullStories } from "@/data/heritage";
import { Edit3, Trash2, Plus } from "lucide-react";

