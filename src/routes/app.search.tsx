import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { track } from "@/lib/analytics";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";

const recent = ["الونشريس", "سيدي رابح", "الشعر الملحون", "تيسمسيلت"];

type Results = { books: any[]; videos: any[]; stories: any[]; figures: any[] };

function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Results>({ books: [], videos: [], stories: [], figures: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) { setResults({ books: [], videos: [], stories: [], figures: [] }); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const r = await api.search(q);
      setResults(r);
      track("search", { q, hits: r.books.length + r.videos.length + r.stories.length + r.figures.length });
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  // Web Share Target support: accept ?q, ?title, ?text, ?url from PWA share intent
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const parts = [sp.get("q"), sp.get("title"), sp.get("text"), sp.get("url")].filter(Boolean);
    if (parts.length) {
      // Extract a sensible search term: prefer explicit title/text, strip URL noise
      const raw = parts.join(" ").trim();
      const cleaned = raw.replace(/https?:\/\/\S+/g, "").trim() || raw;
      setQ(cleaned);
    }
  }, []);

  return (
    <div className="safe-top px-5 pt-3">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/app")} className="h-10 w-10 grid place-items-center rounded-xl glass">
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في الكتب والفيديوهات..."
            className="w-full h-11 rounded-2xl glass-strong pr-10 pl-10 text-sm outline-none focus:ring-1 focus:ring-[var(--gold)]"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center rounded-full bg-white/10">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {!q && (
        <div className="mt-6">
          <p className="text-xs text-white/50 mb-3">عمليات بحث شائعة</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button key={r} onClick={() => setQ(r)} className="px-3 py-1.5 rounded-full glass text-xs">
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {q && (
        <div className="mt-5 space-y-6 pb-20">
          {results.books.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-white/60 mb-2">الكتب ({results.books.length})</h3>
              <div className="space-y-2">
                {results.books.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link to={`/book/${b.id}`} className="flex gap-3 p-2 rounded-2xl glass">
                      <img src={b.cover} alt="" className="h-16 w-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1">{b.title}</p>
                        <p className="text-[11px] text-white/50 mt-0.5">{b.category} • {b.pages} صفحة</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
          {results.videos.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-white/60 mb-2">الفيديوهات ({results.videos.length})</h3>
              <div className="grid grid-cols-2 gap-3">
                {results.videos.map((v) => (
                  <Link key={v.id} to={`/video/${v.id}`}>
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img src={v.thumbnail} alt="" className="h-full w-full object-cover" />
                    </div>
                    <p className="text-[11px] mt-1 line-clamp-2">{v.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.stories.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-white/60 mb-2">الحكايات ({results.stories.length})</h3>
              <div className="space-y-2">
                {results.stories.slice(0, 6).map((s: any) => (
                  <Link key={s.id} to={`/story/${s.id}`} className="block p-3 rounded-2xl glass">
                    <p className="text-sm font-semibold line-clamp-1">{s.title}</p>
                    <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">{s.subtitle}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.figures.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-white/60 mb-2">الشخصيات ({results.figures.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {results.figures.slice(0, 6).map((f: any) => (
                  <Link key={f.id} to={`/figure/${f.id}`} className="text-center">
                    <img src={f.portrait} alt="" className="aspect-square w-full object-cover rounded-xl" />
                    <p className="text-[10px] mt-1 line-clamp-1">{f.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {loading && <p className="text-center text-xs text-white/40">جاري البحث...</p>}
          {!loading && results.books.length === 0 && results.videos.length === 0 && results.stories.length === 0 && results.figures.length === 0 && (
            <p className="text-center text-sm text-white/50 mt-12">لا توجد نتائج</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
