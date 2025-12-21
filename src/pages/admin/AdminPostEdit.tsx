import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import PostEditor from '@/components/admin/PostEditor';

const AdminPostEdit = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Edit Post</h1>
        <PostEditor postId={id} />
      </div>
    </AdminLayout>
  );
};

export default AdminPostEdit;
