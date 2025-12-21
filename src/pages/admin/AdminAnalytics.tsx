import { RefreshCw, Users, Eye, Clock, TrendingDown } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';

const AdminAnalytics = () => {
  const { analytics, isLoading, refreshAnalytics } = useAnalytics();
  const { posts } = useBlogPosts();

  const postsByViews = [...posts].sort((a, b) => b.views - a.views);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Track your site performance and engagement.</p>
          </div>
          <Button variant="outline" onClick={refreshAnalytics} disabled={isLoading}>
            <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Visits"
            value={analytics?.totalVisits.toLocaleString() || '—'}
            icon={Users}
            trend={{ value: '12%', positive: true }}
          />
          <StatsCard
            title="Page Views"
            value={analytics?.totalPageViews.toLocaleString() || '—'}
            icon={Eye}
            trend={{ value: '8%', positive: true }}
          />
          <StatsCard
            title="Avg. Session"
            value={analytics?.avgSessionDuration || '—'}
            icon={Clock}
            trend={{ value: '5%', positive: true }}
          />
          <StatsCard
            title="Bounce Rate"
            value={analytics?.bounceRate || '—'}
            icon={TrendingDown}
            trend={{ value: '3%', positive: false }}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Traffic Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-6">Weekly Traffic</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {analytics?.visitsByDay.map((day, index) => {
                const maxVisits = Math.max(...(analytics?.visitsByDay.map(d => d.visits) || [1]));
                const height = (day.visits / maxVisits) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors relative group"
                      style={{ height: `${height}%` }}
                    >
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-foreground text-background px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.visits} visits
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-6">Top Pages</h2>
            <div className="space-y-4">
              {analytics?.topPages.map((page, index) => {
                const maxViews = analytics.topPages[0].views;
                const width = (page.views / maxViews) * 100;
                return (
                  <div key={page.page}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground truncate max-w-[250px]">{page.page}</span>
                      <span className="text-sm font-medium text-foreground">{page.views.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Posts Performance */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-heading font-bold text-foreground mb-6">Post Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Post</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Views</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {postsByViews.map(post => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-foreground">{post.title}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
