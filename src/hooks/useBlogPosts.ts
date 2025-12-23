import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const mappedPosts: BlogPost[] = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        category: post.category,
        seoTitle: post.seo_title || '',
        metaDescription: post.meta_description || '',
        keywords: post.keywords || [],
        status: post.status as 'draft' | 'published',
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        views: post.views,
        readTime: post.read_time || '5 min read',
        featuredImage: post.featured_image,
      }));

      setPosts(mappedPosts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          slug: post.slug,
          category: post.category,
          seo_title: post.seoTitle,
          meta_description: post.metaDescription,
          keywords: post.keywords,
          status: post.status,
          read_time: post.readTime,
          featured_image: post.featuredImage,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPosts();
      return data;
    } catch (err: any) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.excerpt !== undefined) dbUpdates.excerpt = updates.excerpt;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.seoTitle !== undefined) dbUpdates.seo_title = updates.seoTitle;
      if (updates.metaDescription !== undefined) dbUpdates.meta_description = updates.metaDescription;
      if (updates.keywords !== undefined) dbUpdates.keywords = updates.keywords;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.readTime !== undefined) dbUpdates.read_time = updates.readTime;
      if (updates.featuredImage !== undefined) dbUpdates.featured_image = updates.featuredImage;
      if (updates.views !== undefined) dbUpdates.views = updates.views;

      const { error } = await supabase
        .from('blog_posts')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchPosts();
    } catch (err: any) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPosts();
    } catch (err: any) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  const getPostBySlug = (slug: string) => {
    return posts.find(post => post.slug === slug);
  };

  const getPublishedPosts = () => {
    return posts.filter(post => post.status === 'published');
  };

  return {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    getPostBySlug,
    getPublishedPosts,
    refetch: fetchPosts,
  };
};
