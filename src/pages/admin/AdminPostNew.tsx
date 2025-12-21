import AdminLayout from '@/components/admin/AdminLayout';
import PostEditor from '@/components/admin/PostEditor';

const AdminPostNew = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Create New Post</h1>
        <PostEditor />
      </div>
    </AdminLayout>
  );
};

export default AdminPostNew;
