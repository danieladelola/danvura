import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar } from "lucide-react";

const Blog = () => {
  const featuredPost = {
    title: "The Complete Guide to Digital Marketing in 2024",
    excerpt: "Everything you need to know about building a successful digital marketing strategy this year. From AI integration to authentic content creation.",
    category: "Strategy",
    date: "December 15, 2024",
    readTime: "12 min read",
    image: null,
  };

  const posts = [
    {
      title: "5 Social Media Trends That Will Define 2025",
      excerpt: "Stay ahead of the curve with these emerging trends that will shape how brands connect with audiences on social media.",
      category: "Social Media",
      date: "December 10, 2024",
      readTime: "8 min read",
    },
    {
      title: "How to Build a Lead Generation Machine",
      excerpt: "A step-by-step framework for creating systems that consistently attract and convert high-quality leads for your business.",
      category: "Lead Generation",
      date: "December 5, 2024",
      readTime: "10 min read",
    },
    {
      title: "The Psychology Behind High-Converting Landing Pages",
      excerpt: "Understanding the psychological triggers that make visitors take action and how to implement them effectively.",
      category: "Conversion",
      date: "November 28, 2024",
      readTime: "7 min read",
    },
    {
      title: "Email Marketing Secrets: From Zero to 50% Open Rates",
      excerpt: "Practical strategies I've used to help clients achieve exceptional email marketing performance.",
      category: "Email Marketing",
      date: "November 20, 2024",
      readTime: "9 min read",
    },
    {
      title: "Brand Positioning: Standing Out in a Crowded Market",
      excerpt: "How to develop a unique market position that makes your brand memorable and irresistible to your ideal customers.",
      category: "Branding",
      date: "November 15, 2024",
      readTime: "11 min read",
    },
    {
      title: "The ROI of Content Marketing: A Data-Driven Analysis",
      excerpt: "Breaking down the real numbers behind content marketing and how to maximize your return on investment.",
      category: "Content",
      date: "November 10, 2024",
      readTime: "8 min read",
    },
  ];

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
      <section className="py-8 border-y border-border overflow-x-auto">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="flex gap-4 min-w-max">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0
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
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                <span className="text-6xl font-heading font-bold text-primary/30">Featured</span>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {featuredPost.date}
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
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-padding pt-0">
        <div className="container-wide mx-auto">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-8">Latest Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={index}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-primary/20">{post.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground text-xs">{post.date}</span>
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
                    <span className="text-primary text-sm font-medium group-hover:underline cursor-pointer">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline-dark" size="lg">
              Load More Articles
            </Button>
          </div>
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