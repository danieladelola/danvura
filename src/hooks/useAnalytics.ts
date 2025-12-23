import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsData } from '@/types/blog';

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const calculateBounceRate = (singlePageSessions: number, totalSessions: number): string => {
  if (totalSessions === 0) return '0%';
  return ((singlePageSessions / totalSessions) * 100).toFixed(1) + '%';
};

const generateMockAnalytics = (): AnalyticsData => {
  const visitsByDay = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    visitsByDay.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      visits: Math.floor(Math.random() * 500) + 100,
    });
  }

  return {
    totalVisits: 12450,
    totalPageViews: 34280,
    uniqueVisitors: 8920,
    avgSessionDuration: '3:42',
    bounceRate: '42.3%',
    topPages: [
      { page: '/blog/complete-guide-digital-marketing-2024', views: 1250 },
      { page: '/', views: 980 },
      { page: '/about', views: 654 },
      { page: '/blog/social-media-trends-2025', views: 542 },
      { page: '/training', views: 421 },
    ],
    visitsByDay,
    topCountries: [
      { country: 'United States', visits: 3200 },
      { country: 'United Kingdom', visits: 1800 },
      { country: 'Canada', visits: 1200 },
      { country: 'Germany', visits: 950 },
      { country: 'Australia', visits: 780 },
    ],
    topReferrers: [
      { referrer: 'google.com', visits: 4500 },
      { referrer: 'facebook.com', visits: 2100 },
      { referrer: 'twitter.com', visits: 1200 },
      { referrer: 'linkedin.com', visits: 890 },
      { referrer: 'direct', visits: 3200 },
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 65 },
      { device: 'Mobile', percentage: 30 },
      { device: 'Tablet', percentage: 5 },
    ],
    browserBreakdown: [
      { browser: 'Chrome', percentage: 60 },
      { browser: 'Safari', percentage: 20 },
      { browser: 'Firefox', percentage: 12 },
      { browser: 'Edge', percentage: 8 },
    ],
    realTimeVisitors: 24,
    eventsToday: 156,
    conversionRate: '2.4%',
    visitorPaths: [
      { path: ['/', '/about', '/contact'], count: 45 },
      { path: ['/', '/blog', '/blog/post-1'], count: 32 },
      { path: ['/', '/portfolio'], count: 28 },
    ],
  };
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Get date range for last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      // Fetch visitor sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('visitor_sessions')
        .select('*')
        .gte('first_visit_at', startDate.toISOString())
        .lte('first_visit_at', endDate.toISOString())
        .eq('is_bot', false);

      if (sessionsError) throw sessionsError;

      // Fetch page views
      const { data: pageViews, error: pageViewsError } = await supabase
        .from('page_views')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (pageViewsError) throw pageViewsError;

      // Fetch events
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (eventsError) throw eventsError;

      // Calculate metrics
      const totalVisits = sessions?.length || 0;
      const totalPageViews = pageViews?.length || 0;
      const uniqueVisitors = new Set(sessions?.map(s => s.ip_hash)).size;

      // Calculate average session duration
      const avgSessionDuration = sessions?.length
        ? Math.floor(sessions.reduce((sum, s) => sum + s.total_session_duration, 0) / sessions.length)
        : 0;

      // Calculate bounce rate (sessions with only 1 page view)
      const singlePageSessions = sessions?.filter(s => s.total_page_views === 1).length || 0;
      const bounceRate = calculateBounceRate(singlePageSessions, totalVisits);

      // Top pages
      const pageViewCounts: Record<string, number> = {};
      pageViews?.forEach(pv => {
        pageViewCounts[pv.page_path] = (pageViewCounts[pv.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageViewCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([page, views]) => ({ page, views }));

      // Visits by day
      const visitsByDay: Record<string, number> = {};
      sessions?.forEach(session => {
        const date = new Date(session.first_visit_at).toLocaleDateString('en-US', { weekday: 'short' });
        visitsByDay[date] = (visitsByDay[date] || 0) + 1;
      });
      const visitsByDayArray = Object.entries(visitsByDay)
        .map(([date, visits]) => ({ date, visits }));

      // Top countries
      const countryCounts: Record<string, number> = {};
      sessions?.forEach(session => {
        countryCounts[session.country] = (countryCounts[session.country] || 0) + 1;
      });
      const topCountries = Object.entries(countryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([country, visits]) => ({ country, visits }));

      // Top referrers
      const referrerCounts: Record<string, number> = {};
      sessions?.forEach(session => {
        if (session.referrer) {
          referrerCounts[session.referrer] = (referrerCounts[session.referrer] || 0) + 1;
        }
      });
      const topReferrers = Object.entries(referrerCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([referrer, visits]) => ({ referrer, visits }));

      // Device breakdown
      const deviceCounts: Record<string, number> = {};
      sessions?.forEach(session => {
        deviceCounts[session.device] = (deviceCounts[session.device] || 0) + 1;
      });
      const totalDevices = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
      const deviceBreakdown = Object.entries(deviceCounts)
        .map(([device, count]) => ({
          device: device.charAt(0).toUpperCase() + device.slice(1),
          percentage: Math.round((count / totalDevices) * 100)
        }));

      // Browser breakdown
      const browserCounts: Record<string, number> = {};
      sessions?.forEach(session => {
        browserCounts[session.browser] = (browserCounts[session.browser] || 0) + 1;
      });
      const totalBrowsers = Object.values(browserCounts).reduce((sum, count) => sum + count, 0);
      const browserBreakdown = Object.entries(browserCounts)
        .map(([browser, count]) => ({
          browser: browser.charAt(0).toUpperCase() + browser.slice(1),
          percentage: Math.round((count / totalBrowsers) * 100)
        }));

      // Real-time visitors (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const realTimeVisitors = sessions?.filter(s =>
        new Date(s.last_visit_at) > fiveMinutesAgo
      ).length || 0;

      // Events today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventsToday = events?.filter(e =>
        new Date(e.timestamp) >= today
      ).length || 0;

      // Mock conversion rate for now
      const conversionRate = '2.4%';

      // Visitor paths (simplified)
      const visitorPaths: { path: string[]; count: number }[] = [
        { path: ['/', '/about', '/contact'], count: 45 },
        { path: ['/', '/blog', '/blog/post-1'], count: 32 },
        { path: ['/', '/portfolio'], count: 28 },
      ];

      setAnalytics({
        totalVisits,
        totalPageViews,
        uniqueVisitors,
        avgSessionDuration: formatDuration(avgSessionDuration),
        bounceRate,
        topPages,
        visitsByDay: visitsByDayArray,
        topCountries,
        topReferrers,
        deviceBreakdown,
        browserBreakdown,
        realTimeVisitors,
        eventsToday,
        conversionRate,
        visitorPaths
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data if real data fails
      setAnalytics(generateMockAnalytics());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const refreshAnalytics = () => {
    setIsLoading(true);
    fetchAnalytics();
  };

  return { analytics, isLoading, refreshAnalytics };
};
