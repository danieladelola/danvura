import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem } from '@/types/media';

export const useMedia = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('media_items')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const mappedMedia: MediaItem[] = (data || []).map(item => ({
        id: item.id,
        filename: item.filename,
        originalName: item.original_name,
        url: item.url,
        type: item.type as 'image' | 'video',
        mimeType: item.mime_type,
        size: item.size,
        width: item.width || undefined,
        height: item.height || undefined,
        duration: item.duration || undefined,
        uploadedAt: new Date(item.uploaded_at),
        uploadedBy: item.uploaded_by || 'admin',
        alt: item.alt || undefined,
        caption: item.caption || undefined,
        tags: item.tags || [],
        usage: {
          posts: (item.post_ids || []) as string[],
          portfolios: (item.portfolio_ids || []) as string[],
        },
      }));

      setMedia(mappedMedia);
    } catch (err: any) {
      console.error('Error fetching media:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const uploadMedia = async (
    file: File, 
    metadata?: { alt?: string; caption?: string; tags?: string[] }
  ): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const filename = `${id}-${file.name}`;

      // Convert file to data URL for storage
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const dataUrl = event.target?.result as string;
          
          const { data: userData } = await supabase.auth.getUser();

          const { data, error } = await supabase
            .from('media_items')
            .insert({
              filename,
              original_name: file.name,
              url: dataUrl,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              mime_type: file.type,
              size: file.size,
              width: 1920, // placeholder
              height: 1080, // placeholder
              alt: metadata?.alt,
              caption: metadata?.caption,
              tags: metadata?.tags || [],
              uploaded_by: userData?.user?.id,
            })
            .select()
            .single();

          if (error) throw error;

          const newItem: MediaItem = {
            id: data.id,
            filename: data.filename,
            originalName: data.original_name,
            url: data.url,
            type: data.type as 'image' | 'video',
            mimeType: data.mime_type,
            size: data.size,
            width: data.width || undefined,
            height: data.height || undefined,
            uploadedAt: new Date(data.uploaded_at),
            uploadedBy: data.uploaded_by || 'admin',
            alt: data.alt || undefined,
            caption: data.caption || undefined,
            tags: data.tags || [],
            usage: {
              posts: [],
              portfolios: [],
            },
          };

          await fetchMedia();
          resolve(newItem);
        } catch (err: any) {
          console.error('Error uploading media:', err);
          reject(err);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateMedia = async (id: string, updates: Partial<MediaItem>) => {
    try {
      const dbUpdates: any = {};
      if (updates.alt !== undefined) dbUpdates.alt = updates.alt;
      if (updates.caption !== undefined) dbUpdates.caption = updates.caption;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

      const { error } = await supabase
        .from('media_items')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchMedia();
    } catch (err: any) {
      console.error('Error updating media:', err);
      throw err;
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      const item = media.find(m => m.id === id);
      if (item && (item.usage.posts.length > 0 || item.usage.portfolios.length > 0)) {
        throw new Error('Cannot delete media that is currently in use');
      }

      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMedia();
    } catch (err: any) {
      console.error('Error deleting media:', err);
      throw err;
    }
  };

  const addUsage = async (id: string, type: 'posts' | 'portfolios', itemId: string) => {
    try {
      const item = media.find(m => m.id === id);
      if (!item) return;

      const column = type === 'posts' ? 'post_ids' : 'portfolio_ids';
      const currentIds = item.usage[type];
      
      if (!currentIds.includes(itemId)) {
        const { error } = await supabase
          .from('media_items')
          .update({ [column]: [...currentIds, itemId] })
          .eq('id', id);

        if (error) throw error;
        await fetchMedia();
      }
    } catch (err: any) {
      console.error('Error adding usage:', err);
      throw err;
    }
  };

  const removeUsage = async (id: string, type: 'posts' | 'portfolios', itemId: string) => {
    try {
      const item = media.find(m => m.id === id);
      if (!item) return;

      const column = type === 'posts' ? 'post_ids' : 'portfolio_ids';
      const currentIds = item.usage[type].filter(usageId => usageId !== itemId);
      
      const { error } = await supabase
        .from('media_items')
        .update({ [column]: currentIds })
        .eq('id', id);

      if (error) throw error;
      await fetchMedia();
    } catch (err: any) {
      console.error('Error removing usage:', err);
      throw err;
    }
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
    error,
    uploadMedia,
    updateMedia,
    deleteMedia,
    addUsage,
    removeUsage,
    getMediaById,
    getMediaByType,
    refetch: fetchMedia,
  };
};
