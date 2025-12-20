import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Download, 
  FileText, 
  Video, 
  BookOpen, 
  Wrench,
  CheckCircle,
  Lock,
  Gift
} from "lucide-react";

const Resources = () => {
  const freeResources = [
    {
      icon: FileText,
      title: "Social Media Content Calendar Template",
      description: "A 30-day content calendar with post ideas, hashtag suggestions, and best posting times for each platform.",
      format: "Google Sheets Template",
      downloads: "2,500+",
    },
    {
      icon: FileText,
      title: "Marketing Budget Planner",
      description: "Plan and track your marketing spend across all channels. Includes ROI calculator and recommendations.",
      format: "Excel Template",
      downloads: "1,800+",
    },
    {
      icon: Video,
      title: "Facebook Ads Crash Course",
      description: "A free 2-hour video course covering the fundamentals of Facebook and Instagram advertising.",
      format: "Video Course",
      downloads: "3,200+",
    },
    {
      icon: FileText,
      title: "Email Sequence Swipe File",
      description: "10 proven email sequences you can customize for your business. Welcome series, sales, nurture, and more.",
      format: "PDF + Templates",
      downloads: "2,100+",
    },
  ];

  const premiumResources = [
    {
      icon: BookOpen,
      title: "The Complete Marketing Toolkit",
      description: "Everything you need to run professional marketing campaigns. Includes 50+ templates, checklists, and guides.",
      includes: [
        "Brand strategy workbook",
        "Content planning templates",
        "Email marketing swipe files",
        "Social media templates",
        "Analytics dashboards",
        "Campaign checklists",
      ],
      price: "₦25,000",
    },
    {
      icon: Wrench,
      title: "Lead Generation System Bundle",
      description: "The complete system I use to generate leads for clients. From landing pages to automation sequences.",
      includes: [
        "Landing page templates (10+)",
        "Lead magnet templates",
        "Email automation sequences",
        "CRM setup guides",
        "Facebook ads templates",
        "Conversion tracking setup",
      ],
      price: "₦35,000",
    },
    {
      icon: Video,
      title: "Marketing Masterclass Bundle",
      description: "Collection of in-depth video trainings on specific marketing topics. Learn at your own pace.",
      includes: [
        "Instagram Growth Masterclass",
        "LinkedIn B2B Marketing",
        "Email Marketing Deep Dive",
        "Copywriting Fundamentals",
        "Paid Ads Optimization",
        "Analytics & Reporting",
      ],
      price: "₦45,000",
    },
  ];

  const tools = [
    {
      name: "Canva Pro",
      category: "Design",
      description: "Create stunning graphics, social posts, and marketing materials without design skills.",
      link: "#",
    },
    {
      name: "ConvertKit",
      category: "Email Marketing",
      description: "The best email marketing platform for creators and entrepreneurs. Easy automation.",
      link: "#",
    },
    {
      name: "Hootsuite",
      category: "Social Media",
      description: "Schedule and manage all your social media from one dashboard. Essential for efficiency.",
      link: "#",
    },
    {
      name: "Hotjar",
      category: "Analytics",
      description: "See how users interact with your website. Heatmaps, recordings, and feedback tools.",
      link: "#",
    },
    {
      name: "Ahrefs",
      category: "SEO",
      description: "The best SEO tool for keyword research, competitor analysis, and backlink tracking.",
      link: "#",
    },
    {
      name: "Notion",
      category: "Productivity",
      description: "Organize your marketing projects, content calendars, and team collaboration.",
      link: "#",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-primary font-medium mb-4 animate-fade-up">Resources</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              Tools & Templates to
              <span className="text-primary block">Accelerate Your Growth</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-up animation-delay-200">
              Free and premium resources I've created to help you implement marketing strategies faster 
              and more effectively. The same tools I use with my clients.
            </p>
          </div>
        </div>
      </section>

      {/* Free Resources */}
      <section className="section-padding bg-card">
        <div className="container-wide mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Gift size={28} className="text-primary" />
            <h2 className="text-3xl font-heading font-bold text-foreground">Free Resources</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {freeResources.map((resource, index) => (
              <div
                key={index}
                className="p-8 bg-background border border-border rounded-xl hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <resource.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{resource.format}</span>
                    <span>•</span>
                    <span>{resource.downloads} downloads</span>
                  </div>
                  <Button variant="outline-dark" size="sm">
                    <Download size={16} className="mr-2" />
                    Download Free
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Want access to all free resources in one place?
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/email-list">
                Join Email List for Instant Access
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Resources */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Lock size={28} className="text-primary" />
            <h2 className="text-3xl font-heading font-bold text-foreground">Premium Resources</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {premiumResources.map((resource, index) => (
              <div
                key={index}
                className="p-8 bg-card border border-border rounded-xl flex flex-col"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <resource.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground mb-6">{resource.description}</p>
                
                <div className="mb-6 flex-1">
                  <p className="text-sm font-medium text-foreground mb-3">What's Included:</p>
                  <div className="space-y-2">
                    {resource.includes.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-primary flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-heading font-bold text-foreground">
                      {resource.price}
                    </span>
                    <span className="text-muted-foreground text-sm">One-time payment</span>
                  </div>
                  <Button variant="hero" size="lg" className="w-full">
                    Get Access
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Tools */}
      <section className="section-padding bg-card">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
              Tools I Recommend
            </h2>
            <p className="text-muted-foreground">
              These are the tools I use daily and recommend to my clients for running effective marketing campaigns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <a
                key={index}
                href={tool.link}
                className="p-6 bg-background border border-border rounded-xl hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {tool.category}
                  </span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Want Personalized Guidance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Resources are great for getting started, but if you want a comprehensive transformation, 
              check out my training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/training">
                  Explore Training Programs
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button variant="outline-dark" size="xl" asChild>
                <Link to="/email-list">Join Email List</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Resources;