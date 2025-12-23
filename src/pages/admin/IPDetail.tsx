import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Globe, Monitor, Smartphone, Tablet, Clock, MapPin, MousePointer, Download, AlertTriangle, ExternalLink } from 'lucide-react';

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

interface PageView {
  id: string;
  page_path: string;
  page_title: string;
  referrer: string;
  time_on_page: number;
  timestamp: string;
}

interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_name: string;
  event_data: any;
  page_path: string;
  timestamp: string;
}

const IPDetail = () => {
  const { ipHash } = useParams<{ ipHash: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<VisitorSession | null>(null);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ipHash) {
      fetchIPData();
    }
  }, [ipHash]);

  const fetchIPData = async () => {
    try {
      // Fetch session data
      const { data: sessionData, error: sessionError } = await supabase
        .from('visitor_sessions')
        .select('*')
        .eq('ip_hash', ipHash)
        .single();

      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        setSession(null);
        setIsLoading(false);
        return;
      }
      setSession(sessionData);

      // Fetch page views
      const { data: pageViewsData, error: pageViewsError } = await supabase
        .from('page_views')
        .select('*')
        .eq('session_id', sessionData.id)
        .order('timestamp', { ascending: true });

      if (pageViewsError) {
        console.error('Error fetching page views:', pageViewsError);
        setPageViews([]);
      } else {
        setPageViews(pageViewsData || []);
      }

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('session_id', sessionData.id)
        .order('timestamp', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setEvents([]);
      } else {
        setEvents(eventsData || []);
      }

    } catch (error) {
      console.error('Error fetching IP data:', error);
      setSession(null);
      setPageViews([]);
      setEvents([]);
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

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'click':
        return <MousePointer size={14} />;
      case 'download':
        return <Download size={14} />;
      case 'error':
        return <AlertTriangle size={14} />;
      default:
        return <MousePointer size={14} />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
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

  if (!session) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">IP address not found.</p>
          <Button onClick={() => navigate('/admin/analytics/ip')} className="mt-4">
            Back to IP History
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/analytics/ip')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to IP History
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">IP Details</h1>
            <p className="text-muted-foreground mt-1 font-mono">
              {session.ip_hash}
            </p>
          </div>
        </div>

        {/* Session Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Session Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                {getDeviceIcon(session.device)}
                <div>
                  <p className="text-sm font-medium">Device</p>
                  <p className="text-sm text-muted-foreground capitalize">{session.device}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe size={16} />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {session.city}, {session.region}, {session.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Eye size={16} />
                <div>
                  <p className="text-sm font-medium">Page Views</p>
                  <p className="text-sm text-muted-foreground">{session.total_page_views}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={16} />
                <div>
                  <p className="text-sm font-medium">Session Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(session.total_session_duration)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Browser</p>
                <p className="text-sm text-muted-foreground capitalize">{session.browser}</p>
              </div>

              <div>
                <p className="text-sm font-medium">First Visit</p>
                <p className="text-sm text-muted-foreground">{formatDate(session.first_visit_at)}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Last Visit</p>
                <p className="text-sm text-muted-foreground">{formatDate(session.last_visit_at)}</p>
              </div>
            </div>

            {session.referrer && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium">Initial Referrer</p>
                <p className="text-sm text-muted-foreground break-all">{session.referrer}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium">User Agent</p>
              <p className="text-xs text-muted-foreground break-all font-mono bg-muted p-2 rounded">
                {session.user_agent}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Page Views */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views ({pageViews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pageViews.length === 0 ? (
              <p className="text-muted-foreground">No page views recorded.</p>
            ) : (
              <div className="space-y-3">
                {pageViews.map((view, index) => (
                  <div key={view.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{view.page_title || view.page_path}</p>
                        <p className="text-sm text-muted-foreground">{view.page_path}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">{formatDate(view.timestamp)}</p>
                      {view.time_on_page && (
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(view.time_on_page)} on page
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events */}
        <Card>
          <CardHeader>
            <CardTitle>Events ({events.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground">No events recorded.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.event_type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {event.event_type}
                          </Badge>
                          <p className="font-medium">{event.event_name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.page_path}</p>
                        {event.event_data && Object.keys(event.event_data).length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {JSON.stringify(event.event_data, null, 2)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default IPDetail;