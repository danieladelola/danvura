import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PortfolioItem, PortfolioCategory } from '@/types/blog';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, ArrowLeft, X, Upload, Image, Video } from 'lucide-react';

interface PortfolioEditorProps {
  itemId?: string;
}

const PortfolioEditor = ({ itemId }: PortfolioEditorProps) => {
  const navigate = useNavigate();
  const { items, createItem, updateItem } = usePortfolioItems();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: '' as PortfolioCategory | '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    status: 'draft' as 'draft' | 'published',
  });

  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (itemId) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        setFormData({
          title: item.title,
          category: item.category,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          status: item.status,
        });
        setMediaPreview(item.mediaUrl);
      }
    }
  }, [itemId, items]);

  const categories: PortfolioCategory[] = [
    'Brand Design',
    'Web Designs',
    'Influencer',
    'AdvertIsing',
    'Video Creation/editing',
  ];

  const handleCategoryChange = (category: PortfolioCategory) => {
    setFormData(prev => ({
      ...prev,
      category,
      mediaType: category === 'Video Creation/editing' ? 'video' : 'image',
      mediaUrl: '',
    }));
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = formData.mediaType === 'video';
      const allowedTypes = isVideo
        ? ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm']
        : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: isVideo
            ? 'Please upload a MP4, AVI, MOV, WMV, or WebM video.'
            : 'Please upload a JPG, PNG, GIF, or WebP image.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (10MB max for videos, 5MB for images)
      const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: `Please upload a ${isVideo ? 'video' : 'image'} smaller than ${isVideo ? '10MB' : '5MB'}.`,
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setMediaPreview(result);
        setFormData(prev => ({ ...prev, mediaUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setFormData(prev => ({ ...prev, mediaUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!formData.title || !formData.category || !formData.mediaUrl) {
      toast({
        title: 'Error',
        description: 'Please fill in the title, select a category, and upload media.',
        variant: 'destructive',
      });
      return;
    }

    const itemData = { ...formData, status };

    if (itemId) {
      updateItem(itemId, itemData);
      toast({
        title: 'Portfolio Item Updated',
        description: 'Your portfolio item has been updated successfully.',
      });
    } else {
      createItem(itemData);
      toast({
        title: 'Portfolio Item Created',
        description: 'Your portfolio item has been created successfully.',
      });
    }

    navigate('/admin/portfolio');
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin/portfolio')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Portfolio
        </button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSubmit('draft')}>
            <Save className="mr-2" size={16} />
            Save Draft
          </Button>
          <Button variant="default" onClick={() => handleSubmit('published')}>
            <Eye className="mr-2" size={16} />
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">Portfolio Item Details</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter portfolio item title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value as PortfolioCategory)}
                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-foreground"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">
            {formData.mediaType === 'video' ? 'Video' : 'Image'} Upload
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="media">Upload {formData.mediaType === 'video' ? 'Video' : 'Image'}</Label>
              <div className="mt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="media"
                  accept={formData.mediaType === 'video'
                    ? 'video/mp4,video/avi,video/mov,video/wmv,video/webm'
                    : 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
                  }
                  onChange={handleMediaChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-border hover:border-primary/50 transition-colors"
                  disabled={!formData.category}
                >
                  <div className="flex flex-col items-center gap-2">
                    {formData.mediaType === 'video' ? (
                      <Video size={24} className="text-muted-foreground" />
                    ) : (
                      <Image size={24} className="text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formData.category
                        ? `Click to upload ${formData.mediaType} (${formData.mediaType === 'video' ? 'MP4, AVI, MOV, WMV, WebM - Max 10MB' : 'JPG, PNG, GIF, WebP - Max 5MB'})`
                        : 'Select a category first'
                      }
                    </span>
                  </div>
                </Button>
              </div>
            </div>

            {mediaPreview && (
              <div className="relative">
                {formData.mediaType === 'video' ? (
                  <div className="aspect-[9/16] w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
                    <video
                      src={mediaPreview}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
                    <img
                      src={mediaPreview}
                      alt="Media preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeMedia}
                  className="absolute top-2 right-2"
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;