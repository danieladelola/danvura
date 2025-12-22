import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSubscribers } from "@/hooks/useSubscribers";
import { CheckCircle, Mail, Zap, BookOpen, Gift, Users, ArrowRight } from "lucide-react";

const EmailList = () => {
  const { toast } = useToast();
  const { addSubscriber } = useSubscribers();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source') === 'about' ? 'about' : 'email-list';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      addSubscriber({
        email: email.toLowerCase().trim(),
        firstName: firstName.trim() || undefined,
        source: source as 'email-list' | 'about',
        status: 'active',
      });

      toast({
        title: "Welcome to the list! 🎉",
        description: "Check your inbox for a confirmation email and your free guide.",
      });
      setEmail("");
      setFirstName("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "Weekly Marketing Insights",
      description: "Get actionable strategies and tips delivered every Tuesday that you can implement immediately.",
    },
    {
      icon: BookOpen,
      title: "Exclusive Content",
      description: "Access in-depth guides, case studies, and frameworks not available anywhere else.",
    },
    {
      icon: Gift,
      title: "Free Resources",
      description: "Receive templates, checklists, and tools that I use with my clients.",
    },
    {
      icon: Users,
      title: "Community Access",
      description: "Join a community of ambitious entrepreneurs and marketers all focused on growth.",
    },
  ];

  const testimonials = [
    {
      quote: "Daniel's emails are the only marketing content I actually read. Pure value, no fluff.",
      name: "Chidi Okoro",
      title: "Founder, AfriTech Startup",
    },
    {
      quote: "Implemented one tip from Daniel's newsletter and saw a 40% increase in leads within a month.",
      name: "Fatima Hassan",
      title: "Marketing Director, Scale Finance",
    },
    {
      quote: "These insights would cost thousands if you hired a consultant. Absolute gold.",
      name: "Oluwaseun Adeyemi",
      title: "CEO, GrowthHub Nigeria",
    },
  ];

  const freebie = {
    title: "The Digital Marketing Playbook",
    subtitle: "Free when you join",
    description: "A comprehensive 50-page guide covering everything from brand positioning to paid advertising. The same framework I use with my consulting clients.",
    features: [
      "Complete marketing strategy template",
      "Social media content calendar",
      "Email marketing sequences",
      "Lead generation checklist",
      "ROI tracking spreadsheet",
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-up">
              <Mail size={16} className="text-primary" />
              <span className="text-primary text-sm font-medium">Join 5,000+ Subscribers</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              Get Marketing Insights
              <span className="text-primary block">That Actually Work</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 animate-fade-up animation-delay-200">
              Every Tuesday, I share proven strategies, insider tips, and practical frameworks 
              that help businesses grow. No fluff, just results.
            </p>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-fade-up animation-delay-300">
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="h-14 text-lg bg-card border-border"
                />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 text-lg bg-card border-border"
                />
                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Subscribing..." : "Join the List & Get Free Playbook"}
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                No spam, ever. Unsubscribe anytime with one click.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Free Resource */}
      <section className="section-padding bg-card">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {freebie.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-4 mb-6">
                {freebie.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">{freebie.description}</p>
              <div className="space-y-4">
                {freebie.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-muted rounded-2xl flex items-center justify-center border border-border">
                <div className="text-center px-8">
                  <BookOpen size={64} className="text-primary mx-auto mb-4" />
                  <span className="font-heading text-2xl font-bold text-foreground block">
                    The Digital Marketing
                  </span>
                  <span className="font-heading text-2xl font-bold text-primary block">
                    Playbook
                  </span>
                  <span className="text-muted-foreground mt-2 block">50+ Pages of Value</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              What You'll Get Every Week
            </h2>
            <p className="text-lg text-muted-foreground">
              My newsletter is designed to give you maximum value in minimum time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-8 bg-card border border-border rounded-xl">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-card">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              What Subscribers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 bg-background border border-border rounded-xl">
                <p className="text-foreground text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-heading font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Ready to Level Up Your Marketing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 5,000+ entrepreneurs and marketers who receive actionable insights every Tuesday.
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 flex-1 bg-card border-border"
                />
                <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default EmailList;