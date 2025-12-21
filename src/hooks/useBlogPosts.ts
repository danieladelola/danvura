import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';

const STORAGE_KEY = 'blog_posts';

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Complete Guide to Digital Marketing in 2024',
    content: '<p>Everything you need to know about building a successful digital marketing strategy this year. From AI integration to authentic content creation.</p><p>Digital marketing continues to evolve at a rapid pace. In this comprehensive guide, we\'ll explore the strategies that are working right now and what you need to focus on to stay ahead of the competition.</p>',
    excerpt: 'Everything you need to know about building a successful digital marketing strategy this year.',
    slug: 'complete-guide-digital-marketing-2024',
    category: 'Strategy',
    seoTitle: 'Complete Guide to Digital Marketing 2024 | Expert Strategies',
    metaDescription: 'Master digital marketing in 2024 with our comprehensive guide covering AI integration, content strategy, and proven growth tactics.',
    keywords: ['digital marketing', 'marketing strategy', '2024 trends', 'AI marketing'],
    status: 'published',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    views: 1250,
    readTime: '12 min read',
    featuredImage: null,
  },
  {
    id: '2',
    title: '5 Social Media Trends That Will Define 2025',
    content: '<p>Stay ahead of the curve with these emerging trends that will shape how brands connect with audiences on social media.</p>',
    excerpt: 'Stay ahead of the curve with these emerging trends that will shape how brands connect with audiences.',
    slug: 'social-media-trends-2025',
    category: 'Social Media',
    seoTitle: 'Top 5 Social Media Trends for 2025',
    metaDescription: 'Discover the social media trends that will dominate 2025 and learn how to leverage them for your brand.',
    keywords: ['social media', 'trends', '2025', 'marketing'],
    status: 'published',
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-10T10:00:00Z',
    views: 890,
    readTime: '8 min read',
    featuredImage: null,
  },
  {
    id: '3',
    title: 'How to Build a Lead Generation Machine',
    content: '<p>A step-by-step framework for creating systems that consistently attract and convert high-quality leads for your business.</p>',
    excerpt: 'A step-by-step framework for creating systems that consistently attract and convert high-quality leads.',
    slug: 'build-lead-generation-machine',
    category: 'Lead Generation',
    seoTitle: 'Build a Lead Generation Machine | Step-by-Step Guide',
    metaDescription: 'Learn how to build automated lead generation systems that attract and convert high-quality leads consistently.',
    keywords: ['lead generation', 'sales funnel', 'conversion', 'automation'],
    status: 'published',
    createdAt: '2024-12-05T10:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
    views: 654,
    readTime: '10 min read',
    featuredImage: null,
  },
];

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    }
    setIsLoading(false);
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const createPost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    };
    savePosts([newPost, ...posts]);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, ...updates, updatedAt: new Date().toISOString() } : post
    );
    savePosts(updatedPosts);
  };

  const deletePost = (id: string) => {
    savePosts(posts.filter(post => post.id !== id));
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
    createPost,
    updatePost,
    deletePost,
    getPostBySlug,
    getPublishedPosts,
  };
};
