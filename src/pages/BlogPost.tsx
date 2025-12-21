import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug, getPublishedPosts } = useBlogPosts();
  
  const post = getPostBySlug(slug || '');
  const relatedPosts = getPublishedPosts().filter(p => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2" size={16} />
              Back to Blog
            </Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.keywords.join(', ')} />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="container-narrow mx-auto px-6 md:px-8 relative z-10">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
            
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {post.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-16">
          <div className="container-narrow mx-auto px-6 md:px-8">
            <article 
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Keywords */}
            {post.keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map(keyword => (
                    <span 
                      key={keyword}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="section-padding bg-card">
            <div className="container-wide mx-auto">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-background border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                  >
                    <span className="text-xs text-primary font-medium">{relatedPost.category}</span>
                    <h3 className="text-lg font-heading font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
};

export default BlogPost;
