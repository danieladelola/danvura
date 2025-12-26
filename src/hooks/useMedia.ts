import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MediaItem } from '@/types/media';

const MEDIA_QUERY_KEY = ['media'];

export const useMedia = () => {
  const queryClient = useQueryClient();

  const { data: media = [], isLoading, error } = useQuery({
    queryKey: MEDIA_QUERY_KEY,
    queryFn: async (): Promise<MediaItem[]> => {
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.id,
        filename: item.name,
        originalName: item.name,
        url: `${item.path}`,
        type: item.type.startsWith('image/') ? 'image' : 'video',
        mimeType: item.type,
        size: item.size,
        uploadedAt: new Date(item.uploadDate),
        uploadedBy: 'admin',
        alt: undefined,
        caption: undefined,
        tags: [],
        usage: {
          posts: [],
          portfolios: [],
        },
      }));
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      metadata,
      onProgress,
    }: {
      file: File;
      metadata?: { alt?: string; caption?: string; tags?: string[] };
      onProgress?: (progress: number) => void;
    }): Promise<MediaItem> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({
                id: data.id,
                filename: data.name,
                originalName: data.name,
                url: `${data.path}`,
                type: data.type.startsWith('image/') ? 'image' : 'video',
                mimeType: data.type,
                size: data.size,
                uploadedAt: new Date(data.uploadDate),
                uploadedBy: 'admin',
                alt: metadata?.alt,
                caption: metadata?.caption,
                tags: metadata?.tags || [],
                usage: {
                  posts: [],
                  portfolios: [],
                },
              });
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));

        xhr.open('POST', '/api/media/upload');
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });

  const uploadMedia = async (
    file: File,
    metadata?: { alt?: string; caption?: string; tags?: string[] },
    onProgress?: (progress: number) => void
  ): Promise<MediaItem> => {
    return uploadMutation.mutateAsync({ file, metadata, onProgress });
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MediaItem> }) => {
      // For now, just invalidate - implement update API if needed
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
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
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
      // Implement if needed
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
      // Implement if needed
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
