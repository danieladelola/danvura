import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const IPDetail = () => {
  const { ipHash } = useParams();
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/analytics/ip')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to IP History
          </Button>
          <h1 className="text-2xl font-bold">IP Detail: {ipHash}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed IP analytics data is not available in the file-based system.
              This feature requires a database to store visitor information.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default IPDetail;
