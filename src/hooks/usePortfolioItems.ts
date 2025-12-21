import { useState, useEffect } from 'react';
import { PortfolioItem, PortfolioCategory } from '@/types/blog';

const STORAGE_KEY = 'portfolio_items';

const defaultItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Brand Identity Design',
    category: 'Brand Design',
    mediaUrl: '/media/branddesigns/446280478_465231482561874_7528450714226636932_n.jpg',
    mediaType: 'image',
    status: 'published',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Social Media Graphics',
    category: 'Brand Design',
    mediaUrl: '/media/branddesigns/Ci-gusta-friday-post.png',
    mediaType: 'image',
    status: 'published',
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-10T10:00:00Z',
  },
  {
    id: '3',
    title: 'Video Advertisement',
    category: 'Video Creation/editing',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    mediaType: 'video',
    status: 'published',
    createdAt: '2024-12-05T10:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
  },
];

export const usePortfolioItems = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
      setItems(defaultItems);
    }
    setIsLoading(false);
  }, []);

  const saveItems = (newItems: PortfolioItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const createItem = (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveItems([newItem, ...items]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<PortfolioItem>) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    saveItems(updatedItems);
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
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
    createItem,
    updateItem,
    deleteItem,
    getPublishedItems,
    getItemsByCategory,
  };
};