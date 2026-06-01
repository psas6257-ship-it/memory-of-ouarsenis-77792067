import { Link } from "react-router-dom";
import { books, videos, stories } from "@/data/content";
import { fullStories, figures as historicalFigures, mapLocations, dictionary } from "@/data/heritage";
import { BookOpen, Feather, Users, Map, Film, BookText, TrendingUp, Eye, Download, Star } from "lucide-react";
import { motion } from "framer-motion";

function AdminHome() {
  const stats = [
    { label: "كتب ومخطوطات", value: books.length, icon: BookOpen, color: "from-amber-400/30 to-amber-600/10", to: "/admin/books" },
    { label: "حكايات", value: fullStories.length + stories.length, icon: Feather, color: "from-rose-400/30 to-rose-600/10", to: "/admin/stories" },
    { label: "أعلام تاريخية", value: historicalFigures.length, icon: Users, color: "from-emerald-400/30 to-emerald-600/10", to: "/admin/figures" },
    { label: "مواقع على الخريطة", value: mapLocations.length, icon: Map, color: "from-sky-400/30 to-sky-600/10", to: "/admin/map" },
    { label: "فيديوهات", value: videos.length, icon: Film, color: "from-purple-400/30 to-purple-600/10", to: "/admin/videos" },
    { label: "مفردات القاموس", value: dictionary.length, icon: BookText, color: "from-yellow-400/30 to-yellow-600/10", to: "/admin/translations" },
  ];

  const metrics = [
    { label: "مشاهدات اليوم", value: "2,847", change: "+12.4%", icon: Eye },
    { label: "تنزيلات الكتب", value: "342", change: "+5.1%", icon: Download },
    { label: "متوسط التقييم", value: "4.8", change: "+0.2", icon: Star },
    { label: "مستخدمون نشطون", value: "1,209", change: "+8.7%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          مرحباً في لوحة التحكم
        </h1>
        <p className="text-sm text-white/55 mt-1">إدارة محتوى منصة ذاكرة الجبل التراثية</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10"
          >
            <div className="flex items-center justify-between">
              <m.icon className="h-4 w-4 text-[var(--gold)]" />
              <span className="text-[10px] text-emerald-400">{m.change}</span>
            </div>
            <p className="text-2xl font-bold mt-3 tabular-nums">{m.value}</p>
            <p className="text-[11px] text-white/50 mt-0.5">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Content stats */}
      <div>
        <h2 className="text-sm font-semibold mb-3 text-white/70">إدارة المحتوى</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {stats.map((s, i) => (
            <Link key={s.label} to={s.to as any}>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${s.color} border border-white/10 backdrop-blur-sm cursor-pointer`}
              >
                <s.icon className="h-5 w-5 text-white/80" />
                <p className="text-3xl font-bold mt-4 tabular-nums">{s.value}</p>
                <p className="text-xs text-white/65 mt-1">{s.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent books */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white/70">آخر الكتب المضافة</h2>
          <Link to="/admin/books" className="text-xs text-[var(--gold)]">عرض الكل</Link>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-[11px] text-white/55">
              <tr>
                <th className="text-right p-3 font-medium">العنوان</th>
                <th className="text-right p-3 font-medium hidden md:table-cell">التصنيف</th>
                <th className="text-right p-3 font-medium hidden md:table-cell">السنة</th>
                <th className="text-right p-3 font-medium">الصفحات</th>
              </tr>
            </thead>
            <tbody>
              {books.slice(0, 6).map((b) => (
                <tr key={b.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={b.cover} className="h-9 w-9 rounded-lg object-cover" alt="" />
                      <span className="font-medium line-clamp-1">{b.title}</span>
                    </div>
                  </td>
                  <td className="p-3 text-white/60 hidden md:table-cell">{b.category}</td>
                  <td className="p-3 text-white/60 hidden md:table-cell">{b.year}</td>
                  <td className="p-3 text-white/60 tabular-nums">{b.pages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
