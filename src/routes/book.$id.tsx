import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneFrame } from "@/components/PhoneFrame";
import { books } from "@/data/content";
import { ArrowRight, BookOpen, Bookmark, Download, Heart, Share2 } from "lucide-react";
import { useState } from "react";

function BookDetail() {
  const { id } = useParams() as any;
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const book = books.find((b) => b.id === id) ?? books[0];

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 relative">
        {/* Hero */}
        <div className="relative h-80 overflow-hidden">
          <img src={book.cover} alt={book.title} className="absolute inset-0 h-full w-full object-cover scale-110 blur-md opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
          <div className="absolute top-4 inset-x-4 flex items-center justify-between safe-top z-10">
            <button onClick={() => navigate("/app/library")} className="h-10 w-10 rounded-full glass-strong grid place-items-center">
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              <button onClick={() => setFav((f) => !f)} className="h-10 w-10 rounded-full glass-strong grid place-items-center">
                <Heart className={`h-4 w-4 ${fav ? "fill-red-400 text-red-400" : ""}`} />
              </button>
              <button className="h-10 w-10 rounded-full glass-strong grid place-items-center">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 grid place-items-center pb-4">
            <motion.div
              initial={{ y: 30, opacity: 0, rotateY: -15 }}
              animate={{ y: 0, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
              style={{ boxShadow: "0 40px 80px -20px oklch(0 0 0 / 0.7), 0 0 60px -10px var(--gold)" }}
            >
              <img src={book.cover} alt={book.title} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
          </div>
        </div>

        <div className="px-6 mt-2">
          <p className="text-[11px] text-[var(--gold)] tracking-widest">{book.category}</p>
          <h1 className="mt-1.5 text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {book.title}
          </h1>
          <p className="mt-1 text-xs text-white/55">{book.author} • {book.year}</p>

          <div className="mt-4 flex gap-2">
            <div className="flex-1 rounded-2xl glass p-3 text-center">
              <p className="text-base font-bold">{book.pages}</p>
              <p className="text-[10px] text-white/50">صفحة</p>
            </div>
            <div className="flex-1 rounded-2xl glass p-3 text-center">
              <p className="text-base font-bold">PDF</p>
              <p className="text-[10px] text-white/50">الصيغة</p>
            </div>
            <div className="flex-1 rounded-2xl glass p-3 text-center">
              <p className="text-base font-bold">عربية</p>
              <p className="text-[10px] text-white/50">اللغة</p>
            </div>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-white/80">نبذة</h3>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">{book.description}</p>

          <h3 className="mt-6 text-sm font-semibold text-white/80">الفهرس</h3>
          <div className="mt-2 rounded-2xl glass divide-y divide-white/5">
            {["مقدمة", "السياق التاريخي", "تحليل الوثائق", "خاتمة وخلاصات"].map((ch, i) => (
              <div key={ch} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--gold)] tabular-nums">0{i + 1}</span>
                  <span className="text-sm">{ch}</span>
                </div>
                <Bookmark className="h-4 w-4 text-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating action bar */}
      <div className="absolute bottom-0 inset-x-0 safe-bottom p-4 z-50">
        <div className="glass-strong rounded-3xl p-2 flex gap-2 shadow-luxe">
          <a
            href={book.pdf}
            download
            className="h-12 w-12 grid place-items-center rounded-2xl bg-white/5"
          >
            <Download className="h-4.5 w-4.5 text-[var(--gold)]" />
          </a>
          <Link
            to={`/read/${book.id}`}
            className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm text-black shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--gold), var(--clay))" }}
          >
            <BookOpen className="h-4 w-4" />
            ابدأ القراءة
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default BookDetail;
