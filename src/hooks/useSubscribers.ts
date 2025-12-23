import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Subscriber } from '@/types/subscriber';

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscribers')
        .select('*')
        .order('signup_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const mappedSubscribers: Subscriber[] = (data || []).map(sub => ({
        id: sub.id,
        email: sub.email,
        firstName: sub.name || undefined,
        source: 'email-list' as const,
        status: sub.status as 'active' | 'unsubscribed',
        signupDate: sub.signup_date,
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

      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          email: subscriber.email,
          name: subscriber.firstName,
          status: subscriber.status,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Email already subscribed');
        }
        throw error;
      }

      await fetchSubscribers();
      return data;
    } catch (err: any) {
      console.error('Error adding subscriber:', err);
      throw err;
    }
  };

  const updateSubscriber = async (id: string, updates: Partial<Subscriber>) => {
    try {
      const dbUpdates: any = {};
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.firstName !== undefined) dbUpdates.name = updates.firstName;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase
        .from('subscribers')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchSubscribers();
    } catch (err: any) {
      console.error('Error updating subscriber:', err);
      throw err;
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSubscribers();
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      throw err;
    }
  };

  const deleteSubscribers = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .in('id', ids);

      if (error) throw error;

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
