import { useState, useRef } from 'react';
import { Upload, Search, X, Plus, Image as ImageIcon, Video } from 'lucide-react';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/use-toast';
import { MediaItem, MediaType } from '@/types/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MediaPickerProps {
  selectedMedia?: MediaItem;
  onSelect: (media: MediaItem) => void;
  type?: MediaType;
  multiple?: boolean;
  trigger?: React.ReactNode;
}

const MediaPicker = ({ selectedMedia, onSelect, type = 'all', multiple = false, trigger }: MediaPickerProps) => {
  const { media, uploadMedia } = useMedia();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>(selectedMedia ? [selectedMedia] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media
    .filter(item => {
      const matchesSearch = item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = type === 'all' || item.type === type;
      return matchesSearch && matchesType;
    });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      try {
        const newMedia = await uploadMedia(file);
        uploadedCount++;
        if (!multiple) {
          setSelectedItems([newMedia]);
          onSelect(newMedia);
          setIsOpen(false);
          break;
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setIsUploading(false);
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

  const handleSelect = (item: MediaItem) => {
    if (multiple) {
      const isSelected = selectedItems.some(selected => selected.id === item.id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      setSelectedItems([item]);
      onSelect(item);
      setIsOpen(false);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple && selectedItems.length > 0) {
      // For multiple selection, we'll pass the first item for now
      // In a real implementation, you'd handle multiple selections
      onSelect(selectedItems[0]);
    }
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" className="w-full justify-start">
      <Plus className="mr-2" size={16} />
      {selectedMedia ? 'Change Media' : 'Select Media'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 overflow-hidden">
            <div className="space-y-4 h-full flex flex-col">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Media Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedItems.some(selected => selected.id === item.id);
                    return (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleSelect(item)}
                      >
                        <CardContent className="p-2">
                          <div className="aspect-square relative bg-muted rounded overflow-hidden">
                            {item.type === 'image' ? (
                              <img
                                src={item.url}
                                alt={item.alt || item.originalName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <Video size={32} className="text-muted-foreground" />
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <div className="bg-primary text-primary-foreground rounded-full p-1">
                                  ✓
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-medium truncate" title={item.originalName}>
                              {item.originalName}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {item.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredMedia.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No media files found.</p>
                  </div>
                )}
              </div>

              {multiple && selectedItems.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </p>
                  <Button onClick={handleConfirmSelection}>
                    Select Media
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-lg font-medium mb-2">Upload New Media</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Choose Files'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPicker;