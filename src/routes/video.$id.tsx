import { Link, useNavigate, useParams } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { videos } from "@/data/content";
import { ArrowRight, Heart, Share2 } from "lucide-react";

function VideoPlayer() {
  const { id } = useParams() as any;
  const navigate = useNavigate();
  const v = videos.find((x) => x.id === id) ?? videos[0];
  const related = videos.filter((x) => x.id !== v.id).slice(0, 6);

  return (
    <PhoneFrame>
      <div className="relative flex-1 flex flex-col bg-black overflow-hidden">
        <div className="absolute top-3 right-3 z-30 safe-top">
          <button onClick={() => navigate("/app/media")} className="h-10 w-10 rounded-full glass-strong grid place-items-center">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative aspect-video bg-black mt-12">
          <iframe
            src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={v.title}
          />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
          <p className="text-[10px] text-[var(--gold)] tracking-widest">{v.category}</p>
          <h1 className="mt-1 text-lg font-bold leading-tight">{v.title}</h1>
          <p className="text-[11px] text-white/50 mt-1">{v.duration}</p>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 h-10 rounded-2xl glass flex items-center justify-center gap-2 text-xs">
              <Heart className="h-4 w-4" /> أعجبني
            </button>
            <button className="flex-1 h-10 rounded-2xl glass flex items-center justify-center gap-2 text-xs">
              <Share2 className="h-4 w-4" /> مشاركة
            </button>
          </div>

          <h3 className="mt-6 text-sm font-semibold">فيديوهات مقترحة</h3>
          <div className="mt-3 space-y-3">
            {related.map((r) => (
              <Link key={r.id} to={`/video/${r.id}`} className="flex gap-3 group">
                <div className="relative w-32 aspect-video rounded-xl overflow-hidden shrink-0">
                  <img src={r.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-black/80 text-[9px]">{r.duration}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-tight line-clamp-2">{r.title}</p>
                  <p className="text-[10px] text-white/45 mt-1">{r.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default VideoPlayer;
