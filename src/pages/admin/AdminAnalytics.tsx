import { RefreshCw, Users, Eye, Clock, TrendingDown, Activity, Globe, Monitor, Smartphone, MousePointer, UserCheck } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminAnalytics = () => {
  const { analytics, isLoading, refreshAnalytics } = useAnalytics();
  const { posts } = useBlogPosts();
  const navigate = useNavigate();

  const postsByViews = [...posts].sort((a, b) => b.views - a.views);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Advanced Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive insights into your website performance and user behavior.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/analytics/ip')}>
              <UserCheck className="mr-2" size={16} />
              View IP History
            </Button>
            <Button variant="outline" onClick={refreshAnalytics} disabled={isLoading}>
              <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={16} />
              Refresh
            </Button>
          </div>
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
          <StatsCard
            title="Real-time Visitors"
            value={analytics?.realTimeVisitors.toString() || '—'}
            icon={Activity}
            trend={{ value: '15%', positive: true }}
          />
          <StatsCard
            title="Events Today"
            value={analytics?.eventsToday.toString() || '—'}
            icon={MousePointer}
            trend={{ value: '22%', positive: true }}
          />
          <StatsCard
            title="Unique Visitors"
            value={analytics?.uniqueVisitors.toLocaleString() || '—'}
            icon={Globe}
            trend={{ value: '18%', positive: true }}
          />
          <StatsCard
            title="Conversion Rate"
            value={analytics?.conversionRate || '—'}
            icon={TrendingDown}
            trend={{ value: '2%', positive: true }}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Traffic Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={20} />
                Weekly Traffic Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics?.visitsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="visits" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor size={20} />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ device, percentage }) => `${device}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {analytics?.deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Browser Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} />
                Browser Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.browserBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="browser" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.topCountries} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="country" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages and Referrers */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Top Referrers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topReferrers.map((referrer, index) => {
                  const maxVisits = analytics.topReferrers[0].visits;
                  const width = (referrer.visits / maxVisits) * 100;
                  return (
                    <div key={referrer.referrer}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground truncate max-w-[250px]">{referrer.referrer}</span>
                        <span className="text-sm font-medium text-foreground">{referrer.visits.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all duration-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Paths */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Visitor Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.visitorPaths.map((path, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      {path.path.map((page, pageIndex) => (
                        <span key={pageIndex} className="flex items-center">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded">{page}</span>
                          {pageIndex < path.path.length - 1 && <span className="mx-2 text-muted-foreground">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">{path.count}</span>
                    <p className="text-xs text-muted-foreground">visitors</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Posts Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Post Performance</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
