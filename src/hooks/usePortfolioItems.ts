import { useState, useEffect, useCallback } from 'react';
import { PortfolioItem, PortfolioCategory } from '@/types/blog';

export const usePortfolioItems = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/portfolio');
      if (!response.ok) throw new Error('Failed to fetch portfolio items');

      const data = await response.json();

      const mappedItems: PortfolioItem[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category as PortfolioCategory,
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType as 'image' | 'video',
        status: item.status as 'draft' | 'published',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
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
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          status: item.status,
        }),
      });

      if (!response.ok) throw new Error('Failed to create portfolio item');

      const data = await response.json();
      await fetchItems();
      return data;
    } catch (err: any) {
      console.error('Error creating portfolio item:', err);
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<PortfolioItem>) => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to update portfolio item');

      await fetchItems();
    } catch (err: any) {
      console.error('Error updating portfolio item:', err);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete portfolio item');

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
