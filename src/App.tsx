import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth";
import { SettingsProvider } from "@/lib/settings";
import { OfflineBanner } from "@/components/OfflineBanner";
import { RegisterSW } from "@/components/RegisterSW";

// Eager-load critical entry pages
import Splash from "./routes/index";
import Onboarding from "./routes/onboarding";
import Login from "./routes/login";
import Register from "./routes/register";
import ForgotPassword from "./routes/forgot-password";
import ResetPassword from "./routes/reset-password";

// Lazy-load everything else (Batch 3 — performance)
const About = lazy(() => import("./routes/about"));
const Privacy = lazy(() => import("./routes/privacy"));
const Terms = lazy(() => import("./routes/terms"));
const Contact = lazy(() => import("./routes/contact"));
const Offline = lazy(() => import("./routes/offline"));
const Quote = lazy(() => import("./routes/quote"));

const BookDetail = lazy(() => import("./routes/book.$id"));
const Reader = lazy(() => import("./routes/read.$id"));
const StoryDetail = lazy(() => import("./routes/story.$id"));
const FigureDetail = lazy(() => import("./routes/figure.$id"));
const VideoDetail = lazy(() => import("./routes/video.$id"));

const AppLayout = lazy(() => import("./routes/app"));
const AppHome = lazy(() => import("./routes/app.index"));
const AppLibrary = lazy(() => import("./routes/app.library"));
const AppStories = lazy(() => import("./routes/app.stories"));
const AppMedia = lazy(() => import("./routes/app.media"));
const AppAudio = lazy(() => import("./routes/app.audio"));
const AppDictionary = lazy(() => import("./routes/app.dictionary"));
const AppFigures = lazy(() => import("./routes/app.figures"));
const AppMap = lazy(() => import("./routes/app.map"));
const AppTimeline = lazy(() => import("./routes/app.timeline"));
const AppNotifications = lazy(() => import("./routes/app.notifications"));
const AppProfile = lazy(() => import("./routes/app.profile"));
const AppSearch = lazy(() => import("./routes/app.search"));
const AppSettings = lazy(() => import("./routes/app.settings"));

const AdminLayout = lazy(() => import("./routes/admin"));
const AdminIndex = lazy(() => import("./routes/admin.index"));
const AdminBooks = lazy(() => import("./routes/admin.books"));
const AdminFigures = lazy(() => import("./routes/admin.figures"));
const AdminMap = lazy(() => import("./routes/admin.map"));
const AdminMedia = lazy(() => import("./routes/admin.media"));
const AdminNotifications = lazy(() => import("./routes/admin.notifications"));
const AdminSettings = lazy(() => import("./routes/admin.settings"));
const AdminStories = lazy(() => import("./routes/admin.stories"));
const AdminTimeline = lazy(() => import("./routes/admin.timeline"));
const AdminTranslations = lazy(() => import("./routes/admin.translations"));
const AdminUsers = lazy(() => import("./routes/admin.users"));
const AdminVideos = lazy(() => import("./routes/admin.videos"));

function RequireUser({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user || user.role !== "admin") return <Navigate to="/login" state={{ from: loc }} replace />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md">
        <div className="mx-auto h-20 w-20 rounded-3xl grid place-items-center mb-6"
          style={{ background: "linear-gradient(135deg, var(--gold), var(--clay))" }}>
          <span className="text-3xl font-black text-black/70">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-display)" }}>
          الصفحة غير موجودة
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">المحتوى الذي تبحث عنه لم يعد متاحًا.</p>
        <a href="/" className="mt-6 inline-flex rounded-2xl bg-[var(--gold)] px-5 py-2.5 text-sm font-bold text-black">
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="h-10 w-10 rounded-full border-2 border-[var(--gold)]/30 border-t-[var(--gold)] animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <OfflineBanner />
        <RegisterSW />
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/offline" element={<Offline />} />
            <Route path="/quote" element={<Quote />} />

            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/read/:id" element={<Reader />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/figure/:id" element={<FigureDetail />} />
            <Route path="/video/:id" element={<VideoDetail />} />

            <Route path="/app" element={<RequireUser><AppLayout /></RequireUser>}>
              <Route index element={<AppHome />} />
              <Route path="library" element={<AppLibrary />} />
              <Route path="stories" element={<AppStories />} />
              <Route path="media" element={<AppMedia />} />
              <Route path="audio" element={<AppAudio />} />
              <Route path="dictionary" element={<AppDictionary />} />
              <Route path="figures" element={<AppFigures />} />
              <Route path="map" element={<AppMap />} />
              <Route path="timeline" element={<AppTimeline />} />
              <Route path="notifications" element={<AppNotifications />} />
              <Route path="profile" element={<AppProfile />} />
              <Route path="search" element={<AppSearch />} />
              <Route path="settings" element={<AppSettings />} />
            </Route>

            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminIndex />} />
              <Route path="books" element={<AdminBooks />} />
              <Route path="figures" element={<AdminFigures />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="stories" element={<AdminStories />} />
              <Route path="timeline" element={<AdminTimeline />} />
              <Route path="translations" element={<AdminTranslations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="videos" element={<AdminVideos />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-center" richColors />
      </SettingsProvider>
    </AuthProvider>
  );
}
