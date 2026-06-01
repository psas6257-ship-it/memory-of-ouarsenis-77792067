import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { books, collections, videos } from "@/data/content";
import { fullStories, quotes } from "@/data/heritage";
import { Play, BookOpen, ChevronLeft, Users, Map, Clock, BookText, Headphones } from "lucide-react";
import mountain from "@/assets/mountain-hero.jpg";

const exploreItems = [
  { to: "/app/figures", label: "أعلام المنطقة", icon: Users },
  { to: "/app/map", label: "خريطة التراث", icon: Map },
  { to: "/app/timeline", label: "الخط الزمني", icon: Clock },
  { to: "/app/dictionary", label: "القاموس", icon: BookText },
  { to: "/app/audio", label: "مكتبة الصوت", icon: Headphones },
] as const;

function Home() {
  const featured = books[0];
  return (
    <div>
      <AppHeader greeting="أهلاً بك في" title="ذاكرة الجبل" />

      {/* Hero featured */}
      <Link to={`/book/${featured.id}`} className="block px-5 mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-56 rounded-3xl overflow-hidden shadow-luxe grain"
        >
          <img src={mountain} alt="" className="absolute inset-0 h-full w-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-tl from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <span className="text-[10px] tracking-[0.25em] text-[var(--gold)] mb-2">★ مميّز اليوم</span>
            <h2 className="text-2xl font-bold leading-tight text-white max-w-[80%]" style={{ fontFamily: "var(--font-display)" }}>
              {featured.title}
            </h2>
            <p className="text-xs text-white/70 mt-1.5 line-clamp-2 max-w-[80%]">{featured.description}</p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-white/90 w-fit px-3 py-1.5 rounded-full glass-strong">
              <BookOpen className="h-3 w-3 text-[var(--gold)]" />
              ابدأ القراءة
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Continue reading */}
      <Section title="تابع القراءة" link="/app/library">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {books.slice(0, 4).map((b, idx) => (
            <Link key={b.id} to={`/book/${b.id}`} className="shrink-0 w-44">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-luxe ring-1 ring-white/5"
              >
                <img src={b.cover} alt={b.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <p className="text-[11px] text-[var(--gold)] tracking-wide">{b.category}</p>
                  <p className="text-xs font-semibold leading-tight line-clamp-2 mt-0.5">{b.title}</p>
                  <div className="mt-2 h-1 w-full rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${30 + idx * 15}%`, background: "var(--gold)" }} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Collections */}
      <Section title="مجموعات التراث" link="/app/library">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {collections.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="shrink-0 relative w-36 h-44 rounded-2xl overflow-hidden shadow-luxe"
            >
              <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-3">
                <p className="text-[10px] text-white/60">{c.count} عنصر</p>
                <p className="text-sm font-bold leading-tight">{c.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Videos */}
      <Section title="فيديوهات مختارة" link="/app/media">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {videos.slice(0, 6).map((v) => (
            <Link key={v.id} to={`/video/${v.id}`} className="shrink-0 w-64">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-luxe">
                <img src={v.thumbnail} alt={v.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-12 w-12 rounded-full glass-strong grid place-items-center">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-medium">
                  {v.duration}
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold line-clamp-2">{v.title}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{v.category}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Explore grid */}
      <Section title="اكتشف">
        <div className="px-5 grid grid-cols-3 gap-2">
          {exploreItems.map((it, idx) => (
            <motion.div
              key={it.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={it.to} className="aspect-square rounded-2xl glass flex flex-col items-center justify-center gap-2 hover:bg-white/5">
                <div className="h-9 w-9 rounded-xl bg-[var(--gold)]/15 grid place-items-center">
                  <it.icon className="h-4 w-4 text-[var(--gold)]" />
                </div>
                <span className="text-[11px] text-white/80 font-medium text-center px-1">{it.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Stories */}
      <Section title="حكايات الجبل" link="/app/stories">
        <div className="px-5 space-y-3 pb-2">
          {fullStories.slice(0, 2).map((s) => (
            <Link key={s.id} to={`/story/${s.id}`} className="block relative h-32 rounded-2xl overflow-hidden shadow-luxe">
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-center max-w-[70%]">
                <span className="text-[10px] text-[var(--gold)] tracking-widest">{s.readTime}</span>
                <p className="text-base font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{s.title}</p>
                <p className="text-[11px] text-white/60 mt-1 line-clamp-2">{s.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Quote */}
      <Section title="من ذاكرة الجبل">
        <div className="px-5">
          <div className="rounded-3xl glass-strong shadow-luxe p-6 relative overflow-hidden">
            <span className="absolute -top-4 right-4 text-7xl text-[var(--gold)]/15 font-serif">"</span>
            <p className="relative text-lg leading-relaxed italic" style={{ fontFamily: "var(--font-display)" }}>
              {quotes[0].text}
            </p>
            <p className="relative mt-3 text-xs text-[var(--gold)]">— {quotes[0].author}</p>
          </div>
        </div>
      </Section>

      <div className="h-4" />
    </div>
  );
}

function Section({ title, link, children }: { title: string; link?: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="px-5 mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold tracking-tight">{title}</h3>
        {link && (
          <Link to={link} className="text-xs text-[var(--gold)] flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default Home;
