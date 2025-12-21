import { useState, useEffect } from 'react';
import { AnalyticsData } from '@/types/blog';

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
  };
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics(generateMockAnalytics());
      setIsLoading(false);
    }, 500);
  }, []);

  const refreshAnalytics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAnalytics(generateMockAnalytics());
      setIsLoading(false);
    }, 500);
  };

  return { analytics, isLoading, refreshAnalytics };
};
