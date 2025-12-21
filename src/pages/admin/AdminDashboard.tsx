import { Link } from 'react-router-dom';
import { Eye, FileText, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { posts } = useBlogPosts();
  const { analytics, isLoading } = useAnalytics();

  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;
  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <Button asChild>
            <Link to="/admin/posts/new">
              Create New Post
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Site Visits"
            value={analytics?.totalVisits.toLocaleString() || '—'}
            icon={Users}
            trend={{ value: '12%', positive: true }}
          />
          <StatsCard
            title="Total Page Views"
            value={analytics?.totalPageViews.toLocaleString() || '—'}
            icon={Eye}
            trend={{ value: '8%', positive: true }}
          />
          <StatsCard
            title="Published Posts"
            value={publishedPosts}
            icon={FileText}
          />
          <StatsCard
            title="Avg. Session Duration"
            value={analytics?.avgSessionDuration || '—'}
            icon={Clock}
            trend={{ value: '5%', positive: true }}
          />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-foreground">Recent Posts</h2>
              <Link to="/admin/posts" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {posts.slice(0, 5).map(post => (
                <div key={post.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        post.status === 'published' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.views} views</span>
                    </div>
                  </div>
                  <Link
                    to={`/admin/posts/edit/${post.id}`}
                    className="text-sm text-primary hover:underline ml-4"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-foreground">Top Pages</h2>
              <Link to="/admin/analytics" className="text-sm text-primary hover:underline">
                View Analytics
              </Link>
            </div>
            <div className="space-y-4">
              {analytics?.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="text-sm text-foreground truncate max-w-[200px]">{page.page}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-heading font-bold text-foreground mb-6">Weekly Traffic</h2>
          <div className="flex items-end justify-between h-40 gap-2">
            {analytics?.visitsByDay.map((day, index) => {
              const maxVisits = Math.max(...(analytics?.visitsByDay.map(d => d.visits) || [1]));
              const height = (day.visits / maxVisits) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary/20 rounded-t hover:bg-primary/30 transition-colors relative group"
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
