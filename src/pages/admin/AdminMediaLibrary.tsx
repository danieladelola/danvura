import { useState, useRef, useEffect } from 'react';
import { Upload, Search, Filter, X, Edit, Trash2, Eye, Image as ImageIcon, Video, Download, Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/use-toast';
import { MediaItem, MediaType, SortOption } from '@/types/media';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const AdminMediaLibrary = () => {
  const { media, uploadMedia, deleteMedia, updateMedia } = useMedia();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MediaType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [editForm, setEditForm] = useState({
    alt: '',
    caption: '',
    tags: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('Media in AdminMediaLibrary:', media);

  useEffect(() => {
    console.log('Media updated:', media.length, 'items');
  }, [media]);

  const filteredAndSortedMedia = media
    .filter(item => {
      const matchesSearch = item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  console.log('Filtered media:', filteredAndSortedMedia.length, 'items');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('Files selected:', files);
    if (!files) return;

    setIsUploading(true);
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      try {
        console.log('Uploading file:', file.name);
        const result = await uploadMedia(file);
        console.log('Upload result:', result);
        uploadedCount++;
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setIsUploading(false);
    console.log('Upload complete, count:', uploadedCount);
    if (uploadedCount > 0) {
      toast({
        title: 'Upload Complete',
        description: `${uploadedCount} file(s) uploaded successfully.`,
      });
    }
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      try {
        deleteMedia(deleteId);
        toast({
          title: 'Media Deleted',
          description: 'The media file has been deleted successfully.',
        });
        setDeleteId(null);
      } catch (error) {
        toast({
          title: 'Delete Failed',
          description: error instanceof Error ? error.message : 'Failed to delete media.',
          variant: 'destructive',
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getGridCols = () => {
    // Responsive grid: 1 col mobile, 2 tablet, 3-4 desktop
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground mt-1">{media.length} total files</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2" size={16} />
              {isUploading ? 'Uploading...' : 'Upload Media'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: MediaType) => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media Grid */}
        <div className={`grid ${getGridCols()} gap-4`}>
          {filteredAndSortedMedia.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-muted">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.alt || item.originalName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', item.url);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjIwQzE0IDIxLjEgMTMuMSAyMiAxMiAyMkMxMC45IDIyIDEwIDIxLjEgMTAgMjBWNEMxMCAyLjkgMTAuOSAyIDEyIDJaTTEyIDYuNUMxMy4zOCA2LjUgMTQuNSA3LjYyIDE0LjUgOUMxNC41IDEwLjM4IDEzLjM4IDExLjUgMTIgMTEuNUMxMC42MiAxMS41IDkuNSAxMC4zOCA5LjUgOUM5LjUgNy42MiAxMC42MiA2LjUgMTIgNi41WiIgZmlsbD0iIzY5NzM4NSIvPgo8L3N2Zz4=';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Video size={48} className="text-muted-foreground" />
                    </div>
                  )}

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingMedia(item);
                        setEditForm({
                          alt: item.alt || '',
                          caption: item.caption || '',
                          tags: item.tags?.join(', ') || '',
                        });
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        // In real app, trigger download
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.download = item.originalName;
                        link.click();
                      }}
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Type badge */}
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2"
                  >
                    {item.type === 'image' ? <ImageIcon size={12} className="mr-1" /> : <Video size={12} className="mr-1" />}
                    {item.type}
                  </Badge>
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium truncate" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </p>
                  {item.caption && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {item.caption}
                    </p>
                  )}
                  {item.usage.posts.length > 0 || item.usage.portfolios.length > 0 ? (
                    <div className="flex gap-1 mt-2">
                      {item.usage.posts.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {item.usage.posts.length} post{item.usage.posts.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {item.usage.portfolios.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {item.usage.portfolios.length} portfolio{item.usage.portfolios.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedMedia.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No media files found.</p>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedMedia?.originalName}</DialogTitle>
              <DialogDescription>
                Uploaded on {selectedMedia?.uploadedAt.toLocaleDateString()} • {formatFileSize(selectedMedia?.size || 0)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedMedia?.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt || selectedMedia.originalName}
                  className="w-full max-h-96 object-contain rounded-lg"
                  loading="lazy"
                />
              ) : (
                <video
                  src={selectedMedia?.url}
                  controls
                  className="w-full max-h-96 rounded-lg"
                />
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium">Alt Text:</label>
                  <p className="text-muted-foreground">{selectedMedia?.alt || 'None'}</p>
                </div>
                <div>
                  <label className="font-medium">Caption:</label>
                  <p className="text-muted-foreground">{selectedMedia?.caption || 'None'}</p>
                </div>
                <div>
                  <label className="font-medium">Dimensions:</label>
                  <p className="text-muted-foreground">
                    {selectedMedia?.width && selectedMedia?.height
                      ? `${selectedMedia.width} × ${selectedMedia.height}`
                      : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="font-medium">Tags:</label>
                  <p className="text-muted-foreground">
                    {selectedMedia?.tags?.length ? selectedMedia.tags.join(', ') : 'None'}
                  </p>
                </div>
              </div>

              {(selectedMedia?.usage.posts.length || selectedMedia?.usage.portfolios.length) && (
                <div>
                  <label className="font-medium">Used in:</label>
                  <div className="flex gap-2 mt-2">
                    {selectedMedia?.usage.posts.map(id => (
                      <Badge key={id} variant="outline">Post {id}</Badge>
                    ))}
                    {selectedMedia?.usage.portfolios.map(id => (
                      <Badge key={id} variant="outline">Portfolio {id}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingMedia} onOpenChange={() => setEditingMedia(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Media Metadata</DialogTitle>
              <DialogDescription>
                Update the metadata for {editingMedia?.originalName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alt" className="text-right">
                  Alt Text
                </Label>
                <Input
                  id="alt"
                  value={editForm.alt}
                  onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                  className="col-span-3"
                  placeholder="Alternative text for accessibility"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="caption" className="text-right">
                  Caption
                </Label>
                <Textarea
                  id="caption"
                  value={editForm.caption}
                  onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                  className="col-span-3"
                  placeholder="Optional caption"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="col-span-3"
                  placeholder="Comma-separated tags"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingMedia(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingMedia) {
                    updateMedia(editingMedia.id, {
                      alt: editForm.alt || undefined,
                      caption: editForm.caption || undefined,
                      tags: editForm.tags ? editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
                    });
                    toast({
                      title: 'Media Updated',
                      description: 'The media metadata has been updated successfully.',
                    });
                    setEditingMedia(null);
                  }
                }}
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Media?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the media file.
                {(() => {
                  const item = media.find(m => m.id === deleteId);
                  return item && (item.usage.posts.length > 0 || item.usage.portfolios.length > 0)
                    ? ' This media is currently in use and cannot be deleted.'
                    : '';
                })()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={(() => {
                  const item = media.find(m => m.id === deleteId);
                  return item && (item.usage.posts.length > 0 || item.usage.portfolios.length > 0);
                })()}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMediaLibrary;