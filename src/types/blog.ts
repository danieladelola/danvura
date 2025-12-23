export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  category: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  views: number;
  readTime: string;
  featuredImage: string | null;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type PortfolioCategory = 'Brand Design' | 'Web Designs' | 'Influencer' | 'AdvertIsing' | 'Video Creation/editing';

export interface AnalyticsData {
  totalVisits: number;
  totalPageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: { page: string; views: number }[];
  visitsByDay: { date: string; visits: number }[];
  topCountries: { country: string; visits: number }[];
  topReferrers: { referrer: string; visits: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  browserBreakdown: { browser: string; percentage: number }[];
  realTimeVisitors: number;
  eventsToday: number;
  conversionRate: string;
  visitorPaths: { path: string[]; count: number }[];
}
