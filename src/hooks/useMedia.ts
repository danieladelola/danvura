import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem } from '@/types/media';

const MEDIA_QUERY_KEY = ['media'];

export const useMedia = () => {
  const queryClient = useQueryClient();

  const { data: media = [], isLoading, error } = useQuery({
    queryKey: MEDIA_QUERY_KEY,
    queryFn: async (): Promise<MediaItem[]> => {
      const { data, error: fetchError } = await supabase
        .from('media_items')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      return (data || []).map(item => ({
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
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      metadata,
    }: {
      file: File;
      metadata?: { alt?: string; caption?: string; tags?: string[] };
    }): Promise<MediaItem> => {
      const id = crypto.randomUUID();
      const filename = `${id}-${file.name}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filename);

      console.log('Uploaded file URL:', urlData.publicUrl);

      // Get image dimensions if it's an image
      let width: number | undefined;
      let height: number | undefined;

      if (file.type.startsWith('image/')) {
        const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
        width = dimensions.width;
        height = dimensions.height;
      }

      const { data: userData } = await supabase.auth.getUser();
      console.log('User data:', userData);

      const { data, error } = await supabase
        .from('media_items')
        .insert({
          filename,
          original_name: file.name,
          url: urlData.publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          mime_type: file.type,
          size: file.size,
          width,
          height,
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

      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });

  const uploadMedia = async (
    file: File,
    metadata?: { alt?: string; caption?: string; tags?: string[] }
  ): Promise<MediaItem> => {
    return uploadMutation.mutateAsync({ file, metadata });
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MediaItem> }) => {
      const dbUpdates: {
        alt?: string;
        caption?: string;
        tags?: string[];
      } = {};
      if (updates.alt !== undefined) dbUpdates.alt = updates.alt;
      if (updates.caption !== undefined) dbUpdates.caption = updates.caption;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

      const { error } = await supabase
        .from('media_items')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });

  const updateMedia = async (id: string, updates: Partial<MediaItem>) => {
    return updateMutation.mutateAsync({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const item = media.find(m => m.id === id);
      if (!item) return;

      if (item.usage.posts.length > 0 || item.usage.portfolios.length > 0) {
        throw new Error('Cannot delete media that is currently in use');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([item.filename]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });

  const deleteMedia = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  const addUsageMutation = useMutation({
    mutationFn: async ({
      id,
      type,
      itemId,
    }: {
      id: string;
      type: 'posts' | 'portfolios';
      itemId: string;
    }) => {
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
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });

  const addUsage = async (id: string, type: 'posts' | 'portfolios', itemId: string) => {
    return addUsageMutation.mutateAsync({ id, type, itemId });
  };

  const removeUsageMutation = useMutation({
    mutationFn: async ({
      id,
      type,
      itemId,
    }: {
      id: string;
      type: 'posts' | 'portfolios';
      itemId: string;
    }) => {
      const item = media.find(m => m.id === id);
      if (!item) return;

      const column = type === 'posts' ? 'post_ids' : 'portfolio_ids';
      const currentIds = item.usage[type].filter(usageId => usageId !== itemId);

      const { error } = await supabase
        .from('media_items')
        .update({ [column]: currentIds })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });

  const removeUsage = async (id: string, type: 'posts' | 'portfolios', itemId: string) => {
    return removeUsageMutation.mutateAsync({ id, type, itemId });
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
    refetch: () => queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY }),
  };
};
