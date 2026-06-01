import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { books } from "@/data/content";
import { reader } from "@/lib/reader-state";
import { shareContent } from "@/lib/share";
import { track } from "@/lib/analytics";
import { ArrowRight, Download, Bookmark, BookmarkCheck, Sun, Moon, Share2, ChevronRight, ChevronLeft } from "lucide-react";

function Reader() {
  const { id } = useParams() as any;
  const navigate = useNavigate();
  const book = books.find((b) => b.id === id) ?? books[0];
  const [page, setPage] = useState(() => reader.getPage(book.id));
  const [night, setNight] = useState(() => reader.getNight());
  const [bookmarks, setBookmarks] = useState<number[]>(() => reader.getBookmarks(book.id));

  useEffect(() => { reader.setPage(book.id, page); }, [book.id, page]);
  useEffect(() => { reader.setNight(night); }, [night]);
  useEffect(() => { track("book_read", { id: book.id, page }); }, [book.id, page]);

  const isMarked = bookmarks.includes(page);
  const toggle = () => setBookmarks(reader.toggleBookmark(book.id, page));
  const total = book.pages || 1;
  const pct = Math.round((page / total) * 100);

  return (
    <PhoneFrame>
      <div className={`relative flex-1 flex flex-col ${night ? "bg-black" : "bg-[#1a1410]"}`}>
        <div className="absolute top-0 inset-x-0 z-30 safe-top px-4 py-3 flex items-center justify-between glass-strong">
          <button onClick={() => navigate(`/book/${id}`)} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center">
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold line-clamp-1 max-w-[180px]">{book.title}</p>
            <p className="text-[10px] text-white/50">{bookmarks.length} إشارة</p>
          </div>
          <div className="flex gap-1.5">
            <button onClick={toggle} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center">
              {isMarked ? <BookmarkCheck className="h-4 w-4 text-[var(--gold)]" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button onClick={() => setNight((n) => !n)} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center">
              {night ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => shareContent({ title: book.title, url: location.href })} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <iframe
          src={`${book.pdf}#page=${page}&view=FitH`}
          className={`flex-1 w-full border-0 mt-16 ${night ? "invert hue-rotate-180" : ""}`}
          title={book.title}
        />

        <div className="absolute bottom-0 inset-x-0 z-30 safe-bottom p-3 glass-strong space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center"><ChevronRight className="h-4 w-4" /></button>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gold)" }} />
            </div>
            <button onClick={() => setPage((p) => Math.min(total, p + 1))} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-[11px] text-white/60 tabular-nums w-12 text-center">{page}/{total}</span>
            {book.pdf && (
              <a href={book.pdf} download className="h-9 w-9 rounded-full bg-[var(--gold)] text-black grid place-items-center"><Download className="h-3.5 w-3.5" /></a>
            )}
          </div>
          {bookmarks.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto">
              {bookmarks.map((b) => (
                <button key={b} onClick={() => setPage(b)} className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] whitespace-nowrap">ص {b}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

export default Reader;
