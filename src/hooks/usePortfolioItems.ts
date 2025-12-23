import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PortfolioItem, PortfolioCategory } from '@/types/blog';

export const usePortfolioItems = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const mappedItems: PortfolioItem[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category as PortfolioCategory,
        mediaUrl: item.media_url,
        mediaType: item.media_type as 'image' | 'video',
        status: item.status as 'draft' | 'published',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setItems(mappedItems);
    } catch (err: any) {
      console.error('Error fetching portfolio items:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          title: item.title,
          category: item.category,
          media_url: item.mediaUrl,
          media_type: item.mediaType,
          status: item.status,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchItems();
      return data;
    } catch (err: any) {
      console.error('Error creating portfolio item:', err);
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<PortfolioItem>) => {
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.mediaUrl !== undefined) dbUpdates.media_url = updates.mediaUrl;
      if (updates.mediaType !== undefined) dbUpdates.media_type = updates.mediaType;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase
        .from('portfolio_items')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
    } catch (err: any) {
      console.error('Error updating portfolio item:', err);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
    } catch (err: any) {
      console.error('Error deleting portfolio item:', err);
      throw err;
    }
  };

  const getPublishedItems = () => {
    return items.filter(item => item.status === 'published');
  };

  const getItemsByCategory = (category: PortfolioCategory | 'All') => {
    if (category === 'All') return getPublishedItems();
    return getPublishedItems().filter(item => item.category === category);
  };

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getPublishedItems,
    getItemsByCategory,
    refetch: fetchItems,
  };
};
