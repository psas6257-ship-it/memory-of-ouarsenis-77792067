import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Volume2, Share2, Bookmark } from "lucide-react";
import { fullStories } from "@/data/heritage";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useState } from "react";

function StoryPage() {
  const { id } = useParams() as any;
  const story = fullStories.find((s) => s.id === id);
  const [speaking, setSpeaking] = useState(false);

  if (!story) {
    return (
      <PhoneFrame>
        <div className="flex-1 flex items-center justify-center text-white/60">
          الحكاية غير موجودة
        </div>
      </PhoneFrame>
    );
  }

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(story.body.join(" "));
    u.lang = "ar-SA";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const share = async () => {
    const text = `${story.title}\n${story.quote ?? story.subtitle}\n— ذاكرة الجبل`;
    if (navigator.share) await navigator.share({ title: story.title, text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="relative h-[55vh]">
          <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
          <Link to="/app/stories" className="absolute top-5 right-5 z-10 h-10 w-10 rounded-full glass-strong grid place-items-center">
            <ChevronRight className="h-5 w-5 text-white" />
          </Link>
          <div className="absolute bottom-0 inset-x-0 p-6">
            <span className="inline-block px-3 py-1 rounded-full glass-strong text-[10px] text-[var(--gold)]">{story.category}</span>
            <h1 className="mt-3 text-3xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              {story.title}
            </h1>
            <p className="mt-2 text-sm text-white/70">{story.subtitle} · {story.readTime}</p>
          </div>
        </div>

        <div className="px-6 pb-32 -mt-4 relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={speak} className={`flex-1 h-11 rounded-2xl glass-strong flex items-center justify-center gap-2 text-sm ${speaking ? "text-[var(--gold)]" : "text-white/80"}`}>
              <Volume2 className="h-4 w-4" /> {speaking ? "إيقاف القراءة" : "استمع للقصة"}
            </button>
            <button onClick={share} className="h-11 w-11 rounded-2xl glass-strong grid place-items-center">
              <Share2 className="h-4 w-4 text-white/80" />
            </button>
            <button className="h-11 w-11 rounded-2xl glass-strong grid place-items-center">
              <Bookmark className="h-4 w-4 text-white/80" />
            </button>
          </div>

          {story.quote && (
            <motion.blockquote
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-6 p-5 rounded-2xl border-r-2 border-[var(--gold)] bg-card/40 text-lg leading-relaxed italic"
              style={{ fontFamily: "var(--font-display)" }}
            >
              "{story.quote}"
            </motion.blockquote>
          )}

          <article className="space-y-5 text-[15px] leading-[2] text-white/85">
            {story.body.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {p}
              </motion.p>
            ))}
          </article>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default StoryPage;
