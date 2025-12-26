import { useState, useEffect, useCallback } from 'react';
import { Subscriber } from '@/types/subscriber';

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/emails');
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      const data = await response.json();

      const mappedSubscribers: Subscriber[] = data.map((sub: any) => ({
        id: sub.id,
        email: sub.email,
        firstName: sub.firstName || undefined,
        source: 'email-list' as const,
        status: sub.status as 'active' | 'unsubscribed',
        signupDate: sub.signupDate,
      }));

      setSubscribers(mappedSubscribers);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const addSubscriber = async (subscriber: Omit<Subscriber, 'id' | 'signupDate'>) => {
    try {
      // Rate limiting: max 5 signups per hour (client-side check)
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

      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscriber.email,
          firstName: subscriber.firstName,
          status: subscriber.status,
          signupDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to add subscriber');

      const data = await response.json();

      await fetchSubscribers();
      return data;
    } catch (err: any) {
      console.error('Error adding subscriber:', err);
      throw err;
    }
  };

  const updateSubscriber = async (id: string, updates: Partial<Subscriber>) => {
    try {
      const response = await fetch(`/api/emails/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update subscriber');

      await fetchSubscribers();
    } catch (err: any) {
      console.error('Error updating subscriber:', err);
      throw err;
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const response = await fetch(`/api/emails/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete subscriber');

      await fetchSubscribers();
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      throw err;
    }
  };

  const deleteSubscribers = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await fetch(`/api/emails/${id}`, {
          method: 'DELETE',
        });
      }
      await fetchSubscribers();
    } catch (err: any) {
      console.error('Error deleting subscribers:', err);
      throw err;
    }
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
    error,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    deleteSubscribers,
    getSubscriberByEmail,
    getActiveSubscribers,
    refetch: fetchSubscribers,
  };
};
