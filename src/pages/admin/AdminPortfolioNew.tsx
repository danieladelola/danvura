import AdminLayout from '@/components/admin/AdminLayout';
import PortfolioEditor from '@/components/admin/PortfolioEditor';

const AdminPortfolioNew = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Add New Portfolio Item</h1>
        <PortfolioEditor />
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolioNew;