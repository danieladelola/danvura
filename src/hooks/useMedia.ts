import { useState, useEffect } from 'react';
import { MediaItem } from '@/types/media';

const STORAGE_KEY = 'media_library';

const defaultMedia: MediaItem[] = [
  {
    id: 'test-1',
    filename: 'test-image.jpg',
    originalName: 'test-image.jpg',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5UZXN0IEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
    type: 'image',
    mimeType: 'image/svg+xml',
    size: 1000,
    width: 200,
    height: 200,
    uploadedAt: new Date(),
    uploadedBy: 'admin',
    alt: 'Test Image',
    caption: 'A test image for debugging',
    tags: ['test'],
    usage: {
      posts: [],
      portfolios: [],
    },
  },
];

export const useMedia = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert uploadedAt back to Date objects
      const mediaWithDates = parsed.map((item: any) => ({
        ...item,
        uploadedAt: new Date(item.uploadedAt),
      }));
      setMedia(mediaWithDates);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMedia));
      setMedia(defaultMedia);
    }
    setIsLoading(false);
  }, []);

  // Debug: log when media changes
  useEffect(() => {
    console.log('useMedia: media state updated', media.length, 'items');
  }, [media]);

  const saveMedia = (newMedia: MediaItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMedia));
    setMedia(newMedia);
  };

  const uploadMedia = async (file: File, metadata?: { alt?: string; caption?: string; tags?: string[] }): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const id = Date.now().toString();
      const filename = `${id}-${file.name}`;

      // Convert file to data URL for immediate display
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        console.log('Data URL generated for', file.name, dataUrl.substring(0, 50) + '...');

        const newMediaItem: MediaItem = {
          id,
          filename,
          originalName: file.name,
          url: dataUrl, // Use data URL instead of file path
          type: file.type.startsWith('image/') ? 'image' : 'video',
          mimeType: file.type,
          size: file.size,
          uploadedAt: new Date(),
          uploadedBy: 'admin', // In real app, get from auth
          alt: metadata?.alt,
          caption: metadata?.caption,
          tags: metadata?.tags || [],
          usage: {
            posts: [],
            portfolios: [],
          },
        };

        // For images, you might want to get dimensions, but for now skip
        if (file.type.startsWith('image/')) {
          // In real implementation, use Image API to get dimensions
          newMediaItem.width = 1920; // placeholder
          newMediaItem.height = 1080; // placeholder
        }

        saveMedia([newMediaItem, ...media]);
        console.log('Media uploaded:', newMediaItem);
        resolve(newMediaItem);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    const updatedMedia = media.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    saveMedia(updatedMedia);
  };

  const deleteMedia = (id: string) => {
    const item = media.find(m => m.id === id);
    if (item && (item.usage.posts.length > 0 || item.usage.portfolios.length > 0)) {
      throw new Error('Cannot delete media that is currently in use');
    }
    saveMedia(media.filter(item => item.id !== id));
  };

  const addUsage = (id: string, type: 'posts' | 'portfolios', itemId: string) => {
    const updatedMedia = media.map(item =>
      item.id === id
        ? {
            ...item,
            usage: {
              ...item.usage,
              [type]: [...item.usage[type], itemId],
            },
          }
        : item
    );
    saveMedia(updatedMedia);
  };

  const removeUsage = (id: string, type: 'posts' | 'portfolios', itemId: string) => {
    const updatedMedia = media.map(item =>
      item.id === id
        ? {
            ...item,
            usage: {
              ...item.usage,
              [type]: item.usage[type].filter(usageId => usageId !== itemId),
            },
          }
        : item
    );
    saveMedia(updatedMedia);
  };

  const getMediaById = (id: string) => {
    return media.find(item => item.id === id);
  };

  const getMediaByType = (type: 'image' | 'video') => {
    return media.filter(item => item.type === type);
  };

  return {
    media,
    isLoading,
    uploadMedia,
    updateMedia,
    deleteMedia,
    addUsage,
    removeUsage,
    getMediaById,
    getMediaByType,
  };
};