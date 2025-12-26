import { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '@/types/blog';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();

      const mappedPosts: BlogPost[] = data.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        category: post.category,
        seoTitle: post.seoTitle || '',
        metaDescription: post.metaDescription || '',
        keywords: post.keywords || [],
        status: post.status as 'draft' | 'published',
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        views: post.views,
        readTime: post.readTime || '5 min read',
        featuredImage: post.featuredImage,
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
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          slug: post.slug,
          category: post.category,
          seoTitle: post.seoTitle,
          metaDescription: post.metaDescription,
          keywords: post.keywords,
          status: post.status,
          readTime: post.readTime,
          featuredImage: post.featuredImage,
          views: 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const data = await response.json();
      await fetchPosts();
      return data;
    } catch (err: any) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      await fetchPosts();
    } catch (err: any) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

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
