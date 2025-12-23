-- Create enums for various statuses
CREATE TYPE public.post_status AS ENUM ('draft', 'published');
CREATE TYPE public.media_type AS ENUM ('image', 'video');
CREATE TYPE public.portfolio_category AS ENUM ('Brand Design', 'Web Designs', 'Influencer', 'AdvertIsing', 'Video Creation/editing');
CREATE TYPE public.task_status AS ENUM ('pending', 'completed', 'overdue');
CREATE TYPE public.recurrence_type AS ENUM ('none', 'daily', 'weekly', 'monthly', 'custom');
CREATE TYPE public.billing_cycle AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
CREATE TYPE public.subscriber_status AS ENUM ('active', 'unsubscribed');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =====================
-- USER ROLES TABLE (for admin access)
-- =====================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS: Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- RLS: Only admins can manage roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- BLOG POSTS TABLE
-- =====================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  seo_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  status post_status NOT NULL DEFAULT 'draft',
  views INTEGER NOT NULL DEFAULT 0,
  read_time TEXT DEFAULT '5 min read',
  featured_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

-- Admins can do everything
CREATE POLICY "Admins can manage all posts" ON public.blog_posts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- PORTFOLIO ITEMS TABLE
-- =====================
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category portfolio_category NOT NULL DEFAULT 'Brand Design',
  media_url TEXT NOT NULL,
  media_type media_type NOT NULL DEFAULT 'image',
  status post_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read published portfolio items
CREATE POLICY "Anyone can read published portfolio" ON public.portfolio_items
  FOR SELECT USING (status = 'published');

-- Admins can manage all portfolio items
CREATE POLICY "Admins can manage portfolio" ON public.portfolio_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- MEDIA LIBRARY TABLE
-- =====================
CREATE TABLE public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  type media_type NOT NULL DEFAULT 'image',
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  alt TEXT,
  caption TEXT,
  tags TEXT[] DEFAULT '{}',
  post_ids UUID[] DEFAULT '{}',
  portfolio_ids UUID[] DEFAULT '{}',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view media (for public display)
CREATE POLICY "Anyone can view media" ON public.media_items
  FOR SELECT USING (true);

-- Admins can manage media
CREATE POLICY "Admins can manage media" ON public.media_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- TASKS TABLE
-- =====================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time TIME,
  status task_status NOT NULL DEFAULT 'pending',
  recurrence recurrence_type NOT NULL DEFAULT 'none',
  custom_month_duration INTEGER,
  recurrence_end_date DATE,
  completed_at TIMESTAMPTZ,
  last_notified TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Only admins can access tasks
CREATE POLICY "Admins can manage tasks" ON public.tasks
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- EXPENSES TABLE
-- =====================
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Only admins can access expenses
CREATE POLICY "Admins can manage expenses" ON public.expenses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- SAVINGS GOALS TABLE
-- =====================
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_month TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  saved_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- Only admins can access savings goals
CREATE POLICY "Admins can manage savings" ON public.savings_goals
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =====================
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status subscriber_status NOT NULL DEFAULT 'active',
  signup_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Admins can view all subscribers
CREATE POLICY "Admins can manage subscribers" ON public.subscribers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Allow public insert for newsletter signup (anonymous users can subscribe)
CREATE POLICY "Anyone can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);

-- =====================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();