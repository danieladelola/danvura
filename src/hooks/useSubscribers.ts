import { useState, useEffect } from 'react';
import { Subscriber } from '@/types/subscriber';

const STORAGE_KEY = 'newsletter_subscribers';

const defaultSubscribers: Subscriber[] = [];

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSubscribers(Array.isArray(parsed) ? parsed : defaultSubscribers);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSubscribers));
        setSubscribers(defaultSubscribers);
      }
    } catch (error) {
      console.error('Error loading subscribers from localStorage:', error);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSubscribers));
      setSubscribers(defaultSubscribers);
    }
    setIsLoading(false);
  }, []);

  const saveSubscribers = (newSubscribers: Subscriber[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscribers));
    setSubscribers(newSubscribers);
  };

  const addSubscriber = (subscriber: Omit<Subscriber, 'id' | 'signupDate'>) => {
    // Rate limiting: max 5 signups per hour per IP (simulated)
    const now = Date.now();
    const rateLimitKey = 'newsletter_rate_limit';
    const stored = localStorage.getItem(rateLimitKey);
    if (stored) {
      const { count, timestamp } = JSON.parse(stored);
      const oneHour = 60 * 60 * 1000;
      if (now - timestamp < oneHour && count >= 5) {
        throw new Error('Too many signups. Please try again later.');
      }
      if (now - timestamp < oneHour) {
        localStorage.setItem(rateLimitKey, JSON.stringify({ count: count + 1, timestamp }));
      } else {
        localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, timestamp: now }));
      }
    } else {
      localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, timestamp: now }));
    }

    // Check for duplicate email
    const existing = subscribers.find(s => s.email.toLowerCase() === subscriber.email.toLowerCase());
    if (existing) {
      throw new Error('Email already subscribed');
    }

    const newSubscriber: Subscriber = {
      ...subscriber,
      id: Date.now().toString(),
      signupDate: new Date().toISOString(),
    };
    saveSubscribers([newSubscriber, ...subscribers]);
    return newSubscriber;
  };

  const updateSubscriber = (id: string, updates: Partial<Subscriber>) => {
    const updatedSubscribers = subscribers.map(sub =>
      sub.id === id ? { ...sub, ...updates } : sub
    );
    saveSubscribers(updatedSubscribers);
  };

  const deleteSubscriber = (id: string) => {
    saveSubscribers(subscribers.filter(sub => sub.id !== id));
  };

  const deleteSubscribers = (ids: string[]) => {
    saveSubscribers(subscribers.filter(sub => !ids.includes(sub.id)));
  };

  const getSubscriberByEmail = (email: string) => {
    return subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  };

  const getActiveSubscribers = () => {
    return subscribers.filter(sub => sub.status === 'active');
  };

  return {
    subscribers,
    isLoading,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    deleteSubscribers,
    getSubscriberByEmail,
    getActiveSubscribers,
  };
};