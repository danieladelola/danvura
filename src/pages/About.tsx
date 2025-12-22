import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Target, Lightbulb, Rocket, CheckCircle } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "Every strategy is designed with measurable outcomes in mind. I focus on metrics that matter to your business growth.",
    },
    {
      icon: Lightbulb,
      title: "Strategic Thinking",
      description: "I don't just execute tactics—I develop comprehensive strategies that align with your long-term business goals.",
    },
    {
      icon: Rocket,
      title: "Growth Focused",
      description: "My mission is to help businesses scale sustainably through proven marketing frameworks and systems.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "I hold myself to the highest standards and constantly evolve my skills to deliver exceptional results.",
    },
  ];

  const expertise = [
    "Digital Marketing Strategy",
    "Brand Development & Positioning",
    "Social Media Marketing",
    "Content Marketing & SEO",
    "Email Marketing Automation",
    "Paid Advertising (Meta, Google)",
    "Lead Generation Systems",
    "Marketing Analytics & Reporting",
    "Conversion Rate Optimization",
    "Marketing Team Training",
  ];

  const journey = [
    {
      year: "2019",
      title: "Started My Journey",
      description: "Began helping small businesses establish their online presence and grow through digital marketing.",
    },
    {
      year: "2020",
      title: "Agency Experience",
      description: "Worked with leading marketing agencies, managing campaigns for major brands across Nigeria.",
    },
    {
      year: "2021",
      title: "First 50 Clients",
      description: "Reached my first major milestone of helping 50 businesses transform their marketing.",
    },
    {
      year: "2022",
      title: "Launched Training Programs",
      description: "Started teaching digital marketing, helping entrepreneurs learn the skills they need to grow.",
    },
    {
      year: "2023",
      title: "100+ Clients Milestone",
      description: "Celebrated helping over 100 businesses generate millions in revenue through strategic marketing.",
    },
    {
      year: "2024",
      title: "Expanding Impact",
      description: "Continuing to help businesses across Africa and globally dominate their markets online.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <p className="text-primary font-medium mb-4 animate-fade-up">About Me</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              I'm Daniel Adelola,
              <span className="text-primary block">Digital Marketing Expert</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-up animation-delay-200">
              With 6+ years of hands-on experience, I've dedicated my career to helping businesses 
              build powerful brands and achieve sustainable growth through strategic digital marketing.
            </p>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="section-padding bg-card">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                My Story
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  I started my journey in digital marketing with a simple belief: every business, 
                  no matter its size, deserves access to world-class marketing strategies.
                </p>
                <p>
                  Growing up in Nigeria, I witnessed countless talented entrepreneurs struggle to 
                  reach their potential simply because they didn't know how to effectively market 
                  their products and services online.
                </p>
                <p>
                  This drove me to master the art and science of digital marketing. Over the past 
                  6 years, I've worked with startups, SMEs, and established businesses across various 
                  industries—helping them generate millions in revenue and build brands that truly 
                  connect with their audiences.
                </p>
                <p>
                  Today, my mission goes beyond just consulting. Through my training programs and 
                  resources, I'm empowering the next generation of marketers and business owners 
                  to take control of their growth.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-muted to-secondary rounded-2xl overflow-hidden border border-border">
                <img
                  src="/media/danieladelola.png"
                  alt="Daniel Adelola"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl" />
              <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-primary rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium mb-4">My Values</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              What Drives My Work
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="section-padding bg-card">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-medium mb-4">My Expertise</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Skills That Deliver Results
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Over the years, I've developed deep expertise across all key areas of digital 
                marketing, allowing me to create comprehensive strategies that drive real business growth.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/portfolio">
                  See My Work
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expertise.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg">
                  <CheckCircle size={20} className="text-primary flex-shrink-0" />
                  <span className="text-foreground">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium mb-4">My Journey</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              6 Years of Growth
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {journey.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {item.year}
                  </div>
                  {index < journey.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-4" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
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
            Let's Work Together
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're looking to transform your marketing strategy or learn the skills yourself, 
            I'm here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/training">
                Explore Training Programs
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button variant="outline-dark" size="xl" asChild>
              <Link to="/email-list?source=about">Join My Email List</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;