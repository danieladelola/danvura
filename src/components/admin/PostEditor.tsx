import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BlogPost } from '@/types/blog';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, ArrowLeft, X } from 'lucide-react';

interface PostEditorProps {
  postId?: string;
}

const PostEditor = ({ postId }: PostEditorProps) => {
  const navigate = useNavigate();
  const { posts, createPost, updatePost } = useBlogPosts();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    category: '',
    seoTitle: '',
    metaDescription: '',
    keywords: [] as string[],
    status: 'draft' as 'draft' | 'published',
    readTime: '5 min read',
  });
  
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setFormData({
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
        });
      }
    }
  }, [postId, posts]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      seoTitle: prev.seoTitle || title,
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!formData.title || !formData.content) {
      toast({
        title: 'Error',
        description: 'Please fill in the title and content.',
        variant: 'destructive',
      });
      return;
    }

    const postData = { ...formData, status };

    if (postId) {
      updatePost(postId, postData);
      toast({
        title: 'Post Updated',
        description: 'Your post has been updated successfully.',
      });
    } else {
      createPost(postData);
      toast({
        title: 'Post Created',
        description: 'Your post has been created successfully.',
      });
    }

    navigate('/admin/posts');
  };

  const categories = [
    'Strategy',
    'Social Media',
    'Lead Generation',
    'Branding',
    'Email Marketing',
    'Content',
    'SEO',
    'Advertising',
  ];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin/posts')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Posts
        </button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSubmit('draft')}>
            <Save className="mr-2" size={16} />
            Save Draft
          </Button>
          <Button variant="default" onClick={() => handleSubmit('published')}>
            <Eye className="mr-2" size={16} />
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">Post Details</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Permalink (URL Slug)</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground text-sm">/blog/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-foreground"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary of the post..."
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                value={formData.readTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                placeholder="5 min read"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">Content</h2>
          <div>
            <Label htmlFor="content">Post Content (HTML supported)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="<p>Write your post content here...</p>"
              rows={15}
              className="mt-1 font-mono text-sm"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">SEO Settings</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="SEO optimized title..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.seoTitle.length}/60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Brief description for search engines..."
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>

            <div>
              <Label>Keywords</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="Add a keyword..."
                />
                <Button type="button" variant="outline" onClick={addKeyword}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.keywords.map(keyword => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)} className="hover:text-destructive">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
