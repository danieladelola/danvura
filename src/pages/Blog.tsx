import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { useBlogPosts } from '@/hooks/useBlogPosts';

const Blog = () => {
  const { getPublishedPosts, isLoading } = useBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  
  const posts = getPublishedPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const categories = [
    "All Posts",
    "Strategy",
    "Social Media",
    "Lead Generation",
    "Branding",
    "Email Marketing",
    "Content",
    "SEO",
  ];

  const filteredPosts = selectedCategory === 'All Posts' 
    ? otherPosts 
    : otherPosts.filter(post => post.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-primary font-medium mb-4 animate-fade-up">Blog</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              Marketing Insights & Strategies
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-up animation-delay-200">
              Practical tips, proven strategies, and deep insights to help you master digital marketing 
              and grow your business.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-border">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="flex gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="section-padding">
          <div className="container-wide mx-auto">
            <Link to={`/blog/${featuredPost.slug}`} className="block">
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    {featuredPost.featuredImage ? (
                      <img
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-heading font-bold text-primary/30">Featured</span>
                    )}
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {featuredPost.category}
                      </span>
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(featuredPost.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <Clock size={14} />
                        {featuredPost.readTime}
                      </span>
                      <Button variant="hero" size="default">
                        Read Article
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="section-padding pt-0">
        <div className="container-wide mx-auto">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-8">Latest Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <article className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="aspect-video bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-heading font-bold text-primary/20">{post.category}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                      <span className="text-primary text-sm font-medium group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-card">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Never Miss an Article
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join my email list and get exclusive marketing insights delivered directly to your inbox every week.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/email-list">
              Subscribe to Newsletter
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;
