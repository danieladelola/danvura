-- Run this SQL in your Supabase SQL Editor to create the analytics tables

-- Create enums for analytics
CREATE TYPE public.device_type AS ENUM ('desktop', 'mobile', 'tablet', 'unknown');
CREATE TYPE public.browser_type AS ENUM ('chrome', 'firefox', 'safari', 'edge', 'opera', 'other', 'unknown');
CREATE TYPE public.event_type AS ENUM ('page_view', 'click', 'download', 'error', 'custom');

-- =====================
-- VISITOR SESSIONS TABLE
-- =====================
CREATE TABLE public.visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  ip_hash TEXT NOT NULL, -- SHA256 hash of IP for privacy
  user_agent TEXT,
  browser browser_type NOT NULL DEFAULT 'unknown',
  device device_type NOT NULL DEFAULT 'unknown',
  country TEXT,
  region TEXT,
  city TEXT,
  referrer TEXT,
  is_bot BOOLEAN NOT NULL DEFAULT false,
  first_visit_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_visit_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_page_views INTEGER NOT NULL DEFAULT 0,
  total_session_duration INTEGER NOT NULL DEFAULT 0, -- in seconds
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Only admins can view analytics data
CREATE POLICY "Admins can view visitor sessions" ON public.visitor_sessions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- PAGE VIEWS TABLE
-- =====================
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  time_on_page INTEGER, -- in seconds
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Only admins can view page views
CREATE POLICY "Admins can view page views" ON public.page_views
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- ANALYTICS EVENTS TABLE
-- =====================
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  event_name TEXT,
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view events
CREATE POLICY "Admins can view analytics events" ON public.analytics_events
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- DAILY STATS TABLE (for caching aggregated data)
-- =====================
CREATE TABLE public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  total_page_views INTEGER NOT NULL DEFAULT 0,
  avg_session_duration INTEGER NOT NULL DEFAULT 0, -- in seconds
  bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0, -- percentage
  top_pages JSONB DEFAULT '[]',
  top_countries JSONB DEFAULT '[]',
  top_referrers JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Only admins can view daily stats
CREATE POLICY "Admins can view daily stats" ON public.daily_stats
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_visitor_sessions_session_id ON public.visitor_sessions(session_id);
CREATE INDEX idx_visitor_sessions_ip_hash ON public.visitor_sessions(ip_hash);
CREATE INDEX idx_visitor_sessions_last_visit ON public.visitor_sessions(last_visit_at);
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX idx_page_views_timestamp ON public.page_views(timestamp);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_daily_stats_date ON public.daily_stats(date);

-- Updated_at trigger for daily_stats
CREATE TRIGGER update_daily_stats_updated_at
  BEFORE UPDATE ON public.daily_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment session stats
CREATE OR REPLACE FUNCTION public.increment_session_stats(session_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.visitor_sessions
  SET
    total_page_views = total_page_views + 1,
    last_visit_at = now()
  WHERE id = session_id;

  -- Update or insert first visit time if this is the first page view
  UPDATE public.visitor_sessions
  SET first_visit_at = now()
  WHERE id = session_id AND total_page_views = 1;
END;
$$;