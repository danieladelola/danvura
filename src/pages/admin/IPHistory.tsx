import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const IPHistory = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/analytics')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analytics
          </Button>
          <h1 className="text-2xl font-bold">IP History</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              IP tracking and analytics data is not available in the file-based system.
              This feature requires a database to store visitor information.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default IPHistory;
