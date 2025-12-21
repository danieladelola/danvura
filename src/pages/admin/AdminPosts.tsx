import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminPosts = () => {
  const { posts, deletePost } = useBlogPosts();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deletePost(deleteId);
      toast({
        title: 'Post Deleted',
        description: 'The post has been deleted successfully.',
      });
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">All Posts</h1>
            <p className="text-muted-foreground mt-1">{posts.length} total posts</p>
          </div>
          <Button asChild>
            <Link to="/admin/posts/new">
              <Plus className="mr-2" size={16} />
              Create Post
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Posts Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Title</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Views</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Date</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">/blog/{post.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPosts;
