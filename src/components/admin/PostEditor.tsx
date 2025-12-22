import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BlogPost } from '@/types/blog';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useToast } from '@/hooks/use-toast';
import { useMedia } from '@/hooks/useMedia';
import { MediaItem } from '@/types/media';
import { Save, Eye, ArrowLeft, X, Upload, Image } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import MediaPicker from './MediaPicker';

interface PostEditorProps {
  postId?: string;
}

const PostEditor = ({ postId }: PostEditorProps) => {
  const navigate = useNavigate();
  const { posts, createPost, updatePost } = useBlogPosts();
  const { getMediaById, addUsage, removeUsage } = useMedia();
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
    featuredImage: null as string | null,
  });
  
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const editorRef = useRef<any>(null);

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
          featuredImage: post.featuredImage,
        });
        // If there's a featured image, try to find it in media library
        if (post.featuredImage) {
          const mediaItem = getMediaById(post.featuredImage);
          if (mediaItem) {
            setSelectedMedia(mediaItem);
          }
        }
      }
    }
  }, [postId, posts, getMediaById]);

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

  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media);
    setFormData(prev => ({ ...prev, featuredImage: media.url }));
  };

  const removeImage = () => {
    // Remove usage from previous media if it exists
    if (selectedMedia) {
      removeUsage(selectedMedia.id, 'posts', postId || 'new');
    }
    setSelectedMedia(null);
    setFormData(prev => ({ ...prev, featuredImage: null }));
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
      const newPost = createPost(postData);
      // Add media usage for new post
      if (selectedMedia) {
        addUsage(selectedMedia.id, 'posts', newPost.id);
      }
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

        {/* Featured Image */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">Featured Image</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Featured Image</Label>
              <div className="mt-1">
                <MediaPicker
                  selectedMedia={selectedMedia}
                  onSelect={handleMediaSelect}
                  type="image"
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Image size={24} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {selectedMedia ? 'Change Featured Image' : 'Select Featured Image'}
                        </span>
                      </div>
                    </Button>
                  }
                />
              </div>
            </div>

            {selectedMedia && (
              <div className="relative">
                <div className="aspect-video w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.alt || 'Featured image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2"
                >
                  <X size={16} />
                </Button>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p><strong>File:</strong> {selectedMedia.originalName}</p>
                  {selectedMedia.alt && <p><strong>Alt:</strong> {selectedMedia.alt}</p>}
                  {selectedMedia.caption && <p><strong>Caption:</strong> {selectedMedia.caption}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground">Content</h2>
          <div>
            <Label htmlFor="content">Post Content</Label>
            <div className="mt-1">
              <Editor
                apiKey="7w9971yp1q05yrh9rw4yflf5v4iwlrmho290zfkq2le18scc"
                onInit={(evt, editor) => editorRef.current = editor}
                value={formData.content}
                onEditorChange={(content) => setFormData(prev => ({ ...prev, content }))}
                init={{
                  height: 500,
                  menubar: false,
                  skin: 'oxide-dark',
                  content_css: false,
                  plugins: [
                    'lists', 'link', 'table', 'hr', 'textcolor', 'colorpicker', 'charmap',
                    'undo', 'redo', 'wordcount', 'indent', 'align', 'blockquote',
                    'strikethrough', 'forecolor', 'backcolor', 'removeformat'
                  ],
                  toolbar: 'blocks fontsize | bold italic strikethrough | alignleft aligncenter alignright | bullist numlist | blockquote | link table hr | forecolor backcolor | charmap | indent outdent | undo redo | removeformat',
                  fontsize: '16px',
                  content_style: `
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                      font-size: 16px;
                      line-height: 1.6;
                      color: #ffffff;
                      background-color: #1f2937;
                      margin: 16px;
                    }
                    p { margin: 0 0 1em 0; }
                    h1, h2, h3, h4, h5, h6 {
                      color: #ffffff;
                      font-weight: 600;
                      margin: 1em 0 0.5em 0;
                    }
                    h1 { font-size: 2em; }
                    h2 { font-size: 1.5em; }
                    h3 { font-size: 1.25em; }
                    ul, ol { margin: 1em 0; padding-left: 2em; }
                    blockquote {
                      border-left: 4px solid #dc2626;
                      padding-left: 16px;
                      margin: 1em 0;
                      color: #e5e7eb;
                      font-style: italic;
                    }
                    table { border-collapse: collapse; margin: 1em 0; width: 100%; }
                    table td, table th {
                      border: 1px solid #374151;
                      padding: 8px;
                      text-align: left;
                    }
                    table th { background-color: #111827; font-weight: 600; }
                    a { color: #dc2626; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                  `,
                  statusbar: true,
                  branding: false,
                  elementpath: false,
                  resize: false,
                  toolbar_mode: 'sliding',
                  setup: (editor) => {
                    editor.on('keydown', (e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        if (e.shiftKey) {
                          editor.execCommand('Outdent');
                        } else {
                          editor.execCommand('Indent');
                        }
                      }
                    });
                  }
                }}
              />
            </div>
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
