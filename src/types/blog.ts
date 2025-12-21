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
}

export interface AnalyticsData {
  totalVisits: number;
  totalPageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: { page: string; views: number }[];
  visitsByDay: { date: string; visits: number }[];
}
