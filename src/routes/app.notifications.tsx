import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { notifications } from "@/data/heritage";
import { BookOpen, Film, Bell, Sparkles } from "lucide-react";

const iconFor = (t: string) =>
  t === "story" ? Sparkles : t === "book" ? BookOpen : t === "media" ? Film : Bell;

function Notifs() {
  return (
    <div>
      <AppHeader title="الإشعارات" greeting="آخر مستجدّاتك" />
      <div className="px-5 mt-2 space-y-2">
        {notifications.map((n, i) => {
          const Icon = iconFor(n.type);
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex gap-3 p-4 rounded-2xl glass ${n.unread ? "border border-[var(--gold)]/30" : ""}`}
            >
              <div className="h-10 w-10 rounded-xl bg-[var(--gold)]/15 grid place-items-center shrink-0">
                <Icon className="h-4 w-4 text-[var(--gold)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />}
                </div>
                <p className="text-xs text-white/65 mt-1 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-white/40 mt-1.5">{n.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifs;
