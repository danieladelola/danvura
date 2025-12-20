import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react";

const Portfolio = () => {
  const stats = [
    { icon: DollarSign, number: "₦50M+", label: "Revenue Generated" },
    { icon: Users, number: "100+", label: "Clients Served" },
    { icon: TrendingUp, number: "300%", label: "Average Growth" },
  ];

  const projects = [
    {
      title: "Lumina Fashion - E-commerce Launch",
      category: "Brand Strategy + Digital Marketing",
      description: "Complete brand development and go-to-market strategy for a fashion startup. Built their online presence from zero to a thriving e-commerce business.",
      results: [
        "500+ customers in first month",
        "3x social media following growth",
        "45% engagement rate on content",
        "₦5M revenue in first quarter",
      ],
      industry: "Fashion & Retail",
    },
    {
      title: "TechBridge Solutions - B2B Lead Generation",
      category: "Growth Marketing + Automation",
      description: "Developed a comprehensive lead generation system for a B2B consulting firm, implementing LinkedIn marketing and email automation.",
      results: [
        "150+ qualified leads per month",
        "40% email open rate",
        "2x revenue growth in 6 months",
        "60% reduction in cost per lead",
      ],
      industry: "Technology",
    },
    {
      title: "GreenLeaf Foods - Restaurant Chain Rebrand",
      category: "Brand Strategy + Social Media",
      description: "Complete rebranding and social media overhaul for a local restaurant chain, resulting in increased foot traffic and online orders.",
      results: [
        "80% brand awareness increase",
        "10K+ new social followers",
        "35% increase in online orders",
        "Featured in 3 major publications",
      ],
      industry: "Food & Beverage",
    },
    {
      title: "FinanceHub - Financial Services Marketing",
      category: "Content Marketing + SEO",
      description: "Established thought leadership and organic visibility for a financial services startup through strategic content marketing.",
      results: [
        "500% increase in organic traffic",
        "Top 3 rankings for target keywords",
        "200+ monthly organic leads",
        "₦10M in attributed revenue",
      ],
      industry: "Financial Services",
    },
    {
      title: "HealthPlus Pharmacy - Multi-Location Growth",
      category: "Local Marketing + Paid Ads",
      description: "Drove foot traffic and brand awareness for a pharmacy chain expanding to new locations across Lagos.",
      results: [
        "3 successful new location launches",
        "5x return on ad spend",
        "15K new loyalty members",
        "40% increase in prescription refills",
      ],
      industry: "Healthcare",
    },
    {
      title: "EduPro Academy - Online Course Launch",
      category: "Launch Strategy + Email Marketing",
      description: "Developed and executed launch strategy for an online education platform, building an engaged community before launch.",
      results: [
        "5,000+ email subscribers pre-launch",
        "₦8M in launch week revenue",
        "92% course completion rate",
        "4.9/5 student satisfaction score",
      ],
      industry: "Education",
    },
  ];

  const industries = [
    "All Industries",
    "Fashion & Retail",
    "Technology",
    "Food & Beverage",
    "Financial Services",
    "Healthcare",
    "Education",
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-primary font-medium mb-4 animate-fade-up">My Portfolio</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              Results That Speak
              <span className="text-primary block">For Themselves</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-up animation-delay-200">
              A selection of projects where strategy met execution to deliver measurable business impact. 
              Each case study represents real results for real businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4 justify-center md:justify-start">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <stat.icon size={28} className="text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-foreground">{stat.number}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 overflow-x-auto">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="flex gap-4 min-w-max">
            {industries.map((industry, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section-padding pt-8">
        <div className="container-wide mx-auto">
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-card border border-border rounded-2xl p-8 md:p-10 hover:border-primary/50 hover:shadow-red transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {project.industry}
                      </span>
                      <span className="text-muted-foreground text-sm">{project.category}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                      {project.title}
                      <ArrowUpRight
                        size={24}
                        className="opacity-0 group-hover:opacity-100 text-primary transition-opacity"
                      />
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mb-6">
                      {project.description}
                    </p>
                  </div>
                  <div className="lg:w-80">
                    <h4 className="text-sm font-medium text-foreground mb-4">Key Results:</h4>
                    <div className="space-y-3">
                      {project.results.map((result, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg"
                        >
                          <TrendingUp size={16} className="text-primary flex-shrink-0" />
                          <span className="text-foreground text-sm">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Be My Next Success Story?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you want to work with me directly or learn to do it yourself, I have options for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/training">
                Explore Training Programs
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button variant="outline-dark" size="xl" asChild>
              <Link to="/email-list">Join My Email List</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Portfolio;