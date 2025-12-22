import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PortfolioItem, PortfolioCategory } from '@/types/blog';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { useToast } from '@/hooks/use-toast';
import { useMedia } from '@/hooks/useMedia';
import { MediaItem } from '@/types/media';
import { Save, Eye, ArrowLeft, X, Upload, Image, Video } from 'lucide-react';
import MediaPicker from './MediaPicker';

interface PortfolioEditorProps {
  itemId?: string;
}

const PortfolioEditor = ({ itemId }: PortfolioEditorProps) => {
  const navigate = useNavigate();
  const { items, createItem, updateItem } = usePortfolioItems();
  const { getMediaById, addUsage, removeUsage } = useMedia();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: '' as PortfolioCategory | '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    status: 'draft' as 'draft' | 'published',
  });

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

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
        // If there's media, try to find it in media library
        if (item.mediaUrl) {
          const mediaItem = getMediaById(item.mediaUrl);
          if (mediaItem) {
            setSelectedMedia(mediaItem);
          }
        }
      }
    }
  }, [itemId, items, getMediaById]);

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
    setSelectedMedia(null);
  };

  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media);
    setFormData(prev => ({
      ...prev,
      mediaUrl: media.url,
      mediaType: media.type
    }));
  };

  const removeMedia = () => {
    // Remove usage from previous media if it exists
    if (selectedMedia) {
      removeUsage(selectedMedia.id, 'portfolios', itemId || 'new');
    }
    setSelectedMedia(null);
    setFormData(prev => ({ ...prev, mediaUrl: '' }));
  };

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!formData.title || !formData.category || !formData.mediaUrl) {
      toast({
        title: 'Error',
        description: 'Please fill in the title, select a category, and select media.',
        variant: 'destructive',
      });
      return;
    }

    const itemData = { 
      ...formData, 
      status,
      category: formData.category as PortfolioCategory,
    };

    if (itemId) {
      updateItem(itemId, itemData);
      toast({
        title: 'Portfolio Item Updated',
        description: 'Your portfolio item has been updated successfully.',
      });
    } else {
      const newItem = createItem(itemData);
      // Add media usage for new portfolio item
      if (selectedMedia) {
        addUsage(selectedMedia.id, 'portfolios', newItem.id);
      }
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

        {/* Media Selection */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">
            {formData.mediaType === 'video' ? 'Video' : 'Image'} Selection
          </h2>

          <div className="space-y-4">
            <div>
              <Label>Select {formData.mediaType === 'video' ? 'Video' : 'Image'}</Label>
              <div className="mt-1">
                <MediaPicker
                  selectedMedia={selectedMedia}
                  onSelect={handleMediaSelect}
                  type={formData.mediaType}
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
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
                            ? `${selectedMedia ? 'Change' : 'Select'} ${formData.mediaType} from library`
                            : 'Select a category first'
                          }
                        </span>
                      </div>
                    </Button>
                  }
                />
              </div>
            </div>

            {selectedMedia && (
              <div className="relative">
                {selectedMedia.type === 'video' ? (
                  <div className="aspect-[9/16] w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
                    <video
                      src={selectedMedia.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.alt || 'Media preview'}
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
                <div className="mt-2 text-sm text-muted-foreground">
                  <p><strong>File:</strong> {selectedMedia.originalName}</p>
                  {selectedMedia.alt && <p><strong>Alt:</strong> {selectedMedia.alt}</p>}
                  {selectedMedia.caption && <p><strong>Caption:</strong> {selectedMedia.caption}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;