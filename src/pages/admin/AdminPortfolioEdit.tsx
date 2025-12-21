import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import PortfolioEditor from '@/components/admin/PortfolioEditor';

const AdminPortfolioEdit = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Edit Portfolio Item</h1>
        <PortfolioEditor itemId={id} />
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolioEdit;