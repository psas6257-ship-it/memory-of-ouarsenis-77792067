
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text NOT NULL DEFAULT '',
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles public read" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile + default 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ CONTENT TABLES ============
-- Reusable RLS pattern: public read, admin write
CREATE TABLE public.books (
  id text PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL DEFAULT '',
  cover text,
  pdf text,
  pages int NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.books TO anon, authenticated;
GRANT ALL ON public.books TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.books TO authenticated;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "books public read" ON public.books FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "books admin write" ON public.books FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER books_touch BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.videos (
  id text PRIMARY KEY,
  title text NOT NULL,
  youtube_id text NOT NULL,
  thumbnail text,
  duration text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon, authenticated;
GRANT ALL ON public.videos TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.videos TO authenticated;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos public read" ON public.videos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "videos admin write" ON public.videos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER videos_touch BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.stories (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  image text,
  read_time text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  body jsonb NOT NULL DEFAULT '[]'::jsonb,
  quote text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stories TO anon, authenticated;
GRANT ALL ON public.stories TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.stories TO authenticated;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stories public read" ON public.stories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "stories admin write" ON public.stories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER stories_touch BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.figures (
  id text PRIMARY KEY,
  name text NOT NULL,
  title text NOT NULL DEFAULT '',
  era text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  portrait text,
  bio jsonb NOT NULL DEFAULT '[]'::jsonb,
  achievements jsonb NOT NULL DEFAULT '[]'::jsonb,
  quote text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.figures TO anon, authenticated;
GRANT ALL ON public.figures TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.figures TO authenticated;
ALTER TABLE public.figures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "figures public read" ON public.figures FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "figures admin write" ON public.figures FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER figures_touch BEFORE UPDATE ON public.figures FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  era text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline_events TO anon, authenticated;
GRANT ALL ON public.timeline_events TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.timeline_events TO authenticated;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timeline public read" ON public.timeline_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "timeline admin write" ON public.timeline_events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER timeline_touch BEFORE UPDATE ON public.timeline_events FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.map_locations (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT '',
  x real NOT NULL DEFAULT 0,
  y real NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.map_locations TO anon, authenticated;
GRANT ALL ON public.map_locations TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.map_locations TO authenticated;
ALTER TABLE public.map_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "map public read" ON public.map_locations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "map admin write" ON public.map_locations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER map_touch BEFORE UPDATE ON public.map_locations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.audio_tracks (
  id text PRIMARY KEY,
  title text NOT NULL,
  artist text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  cover text,
  youtube_id text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audio_tracks TO anon, authenticated;
GRANT ALL ON public.audio_tracks TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.audio_tracks TO authenticated;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audio public read" ON public.audio_tracks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "audio admin write" ON public.audio_tracks FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER audio_touch BEFORE UPDATE ON public.audio_tracks FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.dictionary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  pronunciation text,
  meaning text NOT NULL,
  example text,
  category text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.dictionary TO anon, authenticated;
GRANT ALL ON public.dictionary TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.dictionary TO authenticated;
ALTER TABLE public.dictionary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dict public read" ON public.dictionary FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "dict admin write" ON public.dictionary FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'reminder',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO anon, authenticated;
GRANT ALL ON public.notifications TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif public read" ON public.notifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "notif admin write" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- per-user read state
CREATE TABLE public.notification_reads (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_id uuid REFERENCES public.notifications(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, notification_id)
);
GRANT SELECT, INSERT, DELETE ON public.notification_reads TO authenticated;
GRANT ALL ON public.notification_reads TO service_role;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reads" ON public.notification_reads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- key/value app settings (admin-managed)
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT ALL ON public.app_settings TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.app_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.app_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- reading progress (per user)
CREATE TABLE public.reading_progress (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id text REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  progress real NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, book_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_progress TO authenticated;
GRANT ALL ON public.reading_progress TO service_role;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress" ON public.reading_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- favorites
CREATE TABLE public.favorites (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kind text NOT NULL,
  item_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kind, item_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
