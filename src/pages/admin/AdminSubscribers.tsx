import { useState } from 'react';
import { Mail, Search, Trash2, Download, CheckSquare, Square } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSubscribers } from '@/hooks/useSubscribers';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminSubscribers = () => {
  const { subscribers, isLoading, deleteSubscriber, deleteSubscribers, updateSubscriber } = useSubscribers();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (sub.firstName && sub.firstName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteSubscriber(deleteId);
      toast({
        title: 'Subscriber Deleted',
        description: 'The subscriber has been deleted successfully.',
      });
      setDeleteId(null);
      setSelectedIds(selectedIds.filter(id => id !== deleteId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      deleteSubscribers(selectedIds);
      toast({
        title: 'Subscribers Deleted',
        description: `${selectedIds.length} subscribers have been deleted successfully.`,
      });
      setSelectedIds([]);
    }
  };

  const handleStatusChange = (id: string, status: 'active' | 'unsubscribed') => {
    updateSubscriber(id, { status });
    toast({
      title: 'Status Updated',
      description: `Subscriber status changed to ${status}.`,
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedSubscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedSubscribers.map(sub => sub.id));
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'First Name', 'Source', 'Status', 'Signup Date'].join(','),
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.firstName || '',
        sub.source,
        sub.status,
        new Date(sub.signupDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Subscribers exported to CSV successfully.',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading subscribers...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Newsletter Subscribers</h1>
            <p className="text-muted-foreground mt-1">{subscribers.length} total subscribers</p>
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2" size={16} />
                Delete Selected ({selectedIds.length})
              </Button>
            )}
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2" size={16} />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscribers Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 hover:bg-muted/50 rounded px-2 py-1"
                    >
                      {selectedIds.length === paginatedSubscribers.length && paginatedSubscribers.length > 0 ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                      Select All
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Source</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-foreground">Signup Date</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedSubscribers.map(subscriber => (
                  <tr key={subscriber.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleSelect(subscriber.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {selectedIds.includes(subscriber.id) ? (
                          <CheckSquare size={16} className="text-primary" />
                        ) : (
                          <Square size={16} className="text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{subscriber.email}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {subscriber.firstName || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium capitalize">
                        {subscriber.source.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        subscriber.status === 'active' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {new Date(subscriber.signupDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setDeleteId(subscriber.id)}
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

          {paginatedSubscribers.length === 0 && (
            <div className="text-center py-12">
              <Mail className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">No subscribers found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subscriber.
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

export default AdminSubscribers;