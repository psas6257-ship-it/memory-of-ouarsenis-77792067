import { videos } from "@/data/content";
import { Play, Trash2 } from "lucide-react";

export default function AdminVideos() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الفيديوهات ({videos.length})</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {videos.map((v) => (
          <div key={v.id} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="h-12 w-16 rounded-lg bg-black/40 grid place-items-center">
              <Play className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{v.title}</p>
              <p className="text-xs text-white/55">{v.category}</p>
            </div>
            <button className="h-9 w-9 rounded-lg bg-red-500/10 text-red-300 grid place-items-center"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
