import { useState, useEffect } from 'react';
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
      // Since we're using a file-based system without analytics storage,
      // we'll use mock data for demonstration purposes
      setAnalytics(generateMockAnalytics());
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
