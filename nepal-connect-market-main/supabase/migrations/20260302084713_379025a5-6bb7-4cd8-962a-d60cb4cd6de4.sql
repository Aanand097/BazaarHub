
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📦',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subcategories
CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE(category_id, name)
);
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subcategories viewable by everyone" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Admins can manage subcategories" ON public.subcategories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Ads table
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NPR',
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  condition TEXT CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  location TEXT,
  negotiable BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  boosted BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended', 'sold')),
  images TEXT[] DEFAULT '{}',
  views INT DEFAULT 0,
  reports_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '30 days'
);
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved ads viewable by everyone" ON public.ads FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create ads" ON public.ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ads" ON public.ads FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own ads" ON public.ads FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_ads_status ON public.ads(status);
CREATE INDEX idx_ads_category ON public.ads(category_id);
CREATE INDEX idx_ads_user ON public.ads(user_id);

-- Chat threads
CREATE TABLE public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID REFERENCES public.ads(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ad_id, buyer_id, seller_id)
);
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own threads" ON public.chat_threads FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create threads" ON public.chat_threads FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE TRIGGER update_chat_threads_updated_at BEFORE UPDATE ON public.chat_threads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  seen BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Thread participants can view messages" ON public.chat_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.chat_threads WHERE id = thread_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())));
CREATE POLICY "Thread participants can send messages" ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.chat_threads WHERE id = thread_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())));
CREATE POLICY "Users can mark own messages as seen" ON public.chat_messages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.chat_threads WHERE id = thread_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())));

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Ad reports
CREATE TABLE public.ad_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ad_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create reports" ON public.ad_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can view reports" ON public.ad_reports FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = reporter_id);
CREATE POLICY "Admins can manage reports" ON public.ad_reports FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Saved ads
CREATE TABLE public.saved_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, ad_id)
);
ALTER TABLE public.saved_ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saved ads" ON public.saved_ads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save ads" ON public.saved_ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave ads" ON public.saved_ads FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for ad images
INSERT INTO storage.buckets (id, name, public) VALUES ('ad-images', 'ad-images', true);
CREATE POLICY "Anyone can view ad images" ON storage.objects FOR SELECT USING (bucket_id = 'ad-images');
CREATE POLICY "Auth users can upload ad images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ad-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own ad images" ON storage.objects FOR DELETE USING (bucket_id = 'ad-images' AND auth.uid()::text = (storage.foldername(name))[1]);
