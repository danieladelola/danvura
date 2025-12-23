import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Globe, Monitor, Smartphone, Tablet, Clock, MapPin } from 'lucide-react';

interface VisitorSession {
  id: string;
  session_id: string;
  ip_hash: string;
  user_agent: string;
  browser: string;
  device: string;
  country: string;
  region: string;
  city: string;
  referrer: string;
  is_bot: boolean;
  first_visit_at: string;
  last_visit_at: string;
  total_page_views: number;
  total_session_duration: number;
}

const IPHistory = () => {
  const [visitors, setVisitors] = useState<VisitorSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const { data, error } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('last_visit_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching visitors:', error);
        // If table doesn't exist, show empty state
        setVisitors([]);
        return;
      }
      setVisitors(data || []);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      setVisitors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone size={16} />;
      case 'tablet':
        return <Tablet size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/analytics')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Analytics
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">IP Address History</h1>
            <p className="text-muted-foreground mt-1">View detailed activity for each visitor IP address</p>
          </div>
        </div>

        {/* Visitors List */}
        <div className="grid gap-4">
          {visitors.map((visitor) => (
            <Card key={visitor.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/analytics/ip/${visitor.ip_hash}`)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(visitor.device)}
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {visitor.ip_hash.substring(0, 16)}...
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-muted-foreground" />
                      <span className="text-sm">
                        {visitor.city}, {visitor.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {visitor.browser}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye size={14} />
                        <span>{visitor.total_page_views} views</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>{formatDuration(visitor.total_session_duration)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatDate(visitor.last_visit_at)}
                      </div>
                      <Badge variant={visitor.is_bot ? "destructive" : "secondary"} className="text-xs">
                        {visitor.is_bot ? 'Bot' : 'Human'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {visitor.referrer && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Referrer:</span> {visitor.referrer}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {visitors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No visitor data available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Visitor data will appear here once users start visiting your website.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default IPHistory;