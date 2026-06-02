/**
 * طبقة API موحّدة — تستخدم Lovable Cloud (Supabase) كمصدر أساسي،
 * مع رجوع تلقائي إلى البيانات المحلية كـ seed إذا كان الجدول فارغاً.
 */
import { supabase } from "@/integrations/supabase/client";
import { books as localBooks, videos as localVideos, type Book, type VideoItem } from "@/data/content";
import {
  fullStories as localStories,
  figures as localFigures,
  timeline as localTimeline,
  mapLocations as localMap,
  audioTracks as localAudio,
  dictionary as localDict,
  notifications as localNotifs,
} from "@/data/heritage";

async function fetchOrSeed<TLocal, TOut>(
  table: string,
  local: TLocal[],
  mapRow: (row: any) => TOut,
  mapLocal: (item: TLocal) => TOut,
  orderBy: string = "sort_order"
): Promise<TOut[]> {
  try {
    const { data, error } = await supabase.from(table as any).select("*").order(orderBy, { ascending: true });
    if (error) throw error;
    if (data && data.length) return data.map(mapRow);
  } catch {
    /* fall through */
  }
  return local.map(mapLocal);
}

// ------- mappers
const bookFromRow = (r: any): Book => ({
  id: r.id, title: r.title, author: r.author, cover: r.cover || "", pdf: r.pdf || undefined,
  pages: r.pages || 0, category: r.category || "", year: r.year || "", description: r.description || "",
});
const videoFromRow = (r: any): VideoItem => ({
  id: r.id, title: r.title, youtubeId: r.youtube_id,
  thumbnail: r.thumbnail || `https://img.youtube.com/vi/${r.youtube_id}/hqdefault.jpg`,
  duration: r.duration || "", category: r.category || "",
});
const storyFromRow = (r: any) => ({
  id: r.id, title: r.title, subtitle: r.subtitle, image: r.image || "",
  readTime: r.read_time, category: r.category, body: r.body || [], quote: r.quote || undefined,
});
const figureFromRow = (r: any) => ({
  id: r.id, name: r.name, title: r.title, era: r.era, region: r.region,
  portrait: r.portrait || "", bio: r.bio || [], achievements: r.achievements || [], quote: r.quote || undefined,
});
const timelineFromRow = (r: any) => ({ year: r.year, title: r.title, description: r.description, era: r.era });
const mapFromRow = (r: any) => ({
  id: r.id, name: r.name, type: r.type, x: Number(r.x), y: Number(r.y),
  description: r.description, image: r.image || "",
});
const audioFromRow = (r: any) => ({
  id: r.id, title: r.title, artist: r.artist, category: r.category,
  duration: r.duration, cover: r.cover || "", youtubeId: r.youtube_id || undefined,
});
const dictFromRow = (r: any) => ({
  word: r.word, pronunciation: r.pronunciation || undefined,
  meaning: r.meaning, example: r.example || undefined, category: r.category,
});

export const api = {
  // ============ READS ============
  getBooks: () => fetchOrSeed("books", localBooks, bookFromRow, (b) => b),
  getBook: async (id: string): Promise<Book | undefined> => {
    const { data } = await supabase.from("books").select("*").eq("id", id).maybeSingle();
    if (data) return bookFromRow(data);
    return localBooks.find((b) => b.id === id);
  },
  getVideos: () => fetchOrSeed("videos", localVideos, videoFromRow, (v) => v),
  getStories: () => fetchOrSeed("stories", localStories as any, storyFromRow, (s: any) => s),
  getFigures: () => fetchOrSeed("figures", localFigures as any, figureFromRow, (f: any) => f),
  getTimeline: () => fetchOrSeed("timeline_events", localTimeline as any, timelineFromRow, (t: any) => t, "sort_order"),
  getMapLocations: () => fetchOrSeed("map_locations", localMap as any, mapFromRow, (m: any) => m, "name"),
  getAudio: () => fetchOrSeed("audio_tracks", localAudio as any, audioFromRow, (a: any) => a),
  getDictionary: () => fetchOrSeed("dictionary", localDict as any, dictFromRow, (d: any) => d, "word"),
  getNotifications: async () => {
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    if (data && data.length) return data.map((n: any) => ({
      id: n.id, title: n.title, body: n.body, type: n.type,
      time: new Date(n.created_at).toLocaleString(), unread: true,
    }));
    return localNotifs;
  },

  // ============ AUTH ============
  forgotPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  },
  resetPassword: async (_token: string, password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    return { ok: true };
  },

  // ============ SEARCH ============
  search: async (q: string) => {
    const t = q.trim();
    if (!t) return { books: [], videos: [], stories: [], figures: [] };
    const like = `%${t}%`;
    const [books, videos, stories, figures] = await Promise.all([
      supabase.from("books").select("*").or(`title.ilike.${like},description.ilike.${like}`).limit(20),
      supabase.from("videos").select("*").or(`title.ilike.${like},category.ilike.${like}`).limit(20),
      supabase.from("stories").select("*").or(`title.ilike.${like},subtitle.ilike.${like}`).limit(20),
      supabase.from("figures").select("*").or(`name.ilike.${like},title.ilike.${like}`).limit(20),
    ]);
    const lower = t.toLowerCase();
    const fb = (arr: any[], pred: (x: any) => boolean) => (arr && arr.length ? arr : []).filter(pred);
    return {
      books: (books.data?.map(bookFromRow) ?? []).length
        ? books.data!.map(bookFromRow)
        : fb(localBooks, (b) => b.title.toLowerCase().includes(lower) || b.description.toLowerCase().includes(lower)),
      videos: (videos.data?.map(videoFromRow) ?? []).length
        ? videos.data!.map(videoFromRow)
        : fb(localVideos, (v) => v.title.toLowerCase().includes(lower) || v.category.toLowerCase().includes(lower)),
      stories: (stories.data?.map(storyFromRow) ?? []).length
        ? stories.data!.map(storyFromRow)
        : fb(localStories as any, (s: any) => s.title.toLowerCase().includes(lower) || (s.subtitle || "").toLowerCase().includes(lower)),
      figures: (figures.data?.map(figureFromRow) ?? []).length
        ? figures.data!.map(figureFromRow)
        : fb(localFigures as any, (f: any) => f.name.toLowerCase().includes(lower) || f.title.toLowerCase().includes(lower)),
    };
  },
};

export type Api = typeof api;
