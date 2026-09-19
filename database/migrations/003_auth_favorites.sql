-- Link app users to Supabase Auth, add per-user policies, and a server-side favorites table
-- (favorites were browser-storage only, so they never synced between web and mobile).
INSERT INTO public.users (id, email)
  SELECT id, email FROM auth.users WHERE email IS NOT NULL
  ON CONFLICT DO NOTHING;

ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE users ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "own row read"   ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own row update" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own searches"   ON saved_searches FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE favorites (
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_model_id INTEGER     NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, car_model_id)
);
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON favorites FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
