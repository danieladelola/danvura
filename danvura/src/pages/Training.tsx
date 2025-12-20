import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  Video, 
  FileText, 
  Award,
  Star,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

const Training = () => {
  const programs = [
    {
      featured: true,
      title: "Digital Marketing Mastery",
      subtitle: "Complete Program",
      description: "A comprehensive 12-week program covering everything you need to become a skilled digital marketer and grow any business online.",
      price: "₦150,000",
      originalPrice: "₦250,000",
      duration: "12 Weeks",
      students: "500+",
      format: "Online + Live Sessions",
      features: [
        "40+ hours of video content",
        "Weekly live Q&A sessions",
        "Marketing strategy templates",
        "Private community access",
        "1-on-1 coaching calls (3)",
        "Lifetime access & updates",
        "Certificate of completion",
      ],
      modules: [
        "Marketing Fundamentals",
        "Brand Strategy & Positioning",
        "Social Media Marketing",
        "Content Marketing & SEO",
        "Email Marketing Automation",
        "Paid Advertising (Meta & Google)",
        "Lead Generation Systems",
        "Analytics & Optimization",
      ],
    },
    {
      featured: false,
      title: "Social Media Marketing Bootcamp",
      subtitle: "Intensive Course",
      description: "Master social media marketing in 4 weeks. Learn to create viral content, build engaged audiences, and convert followers into customers.",
      price: "₦75,000",
      originalPrice: "₦120,000",
      duration: "4 Weeks",
      students: "300+",
      format: "Online Self-Paced",
      features: [
        "20+ hours of video content",
        "Platform-specific strategies",
        "Content calendar templates",
        "Engagement playbooks",
        "Case study breakdowns",
        "Private community access",
        "Certificate of completion",
      ],
      modules: [
        "Platform Deep Dives",
        "Content Strategy",
        "Visual Branding",
        "Community Building",
      ],
    },
    {
      featured: false,
      title: "Lead Generation Blueprint",
      subtitle: "Specialized Course",
      description: "Build a predictable lead generation system for your business. From landing pages to email sequences that convert.",
      price: "₦100,000",
      originalPrice: "₦150,000",
      duration: "6 Weeks",
      students: "200+",
      format: "Online + Weekly Calls",
      features: [
        "25+ hours of video content",
        "Landing page templates",
        "Email sequence swipe files",
        "CRM setup guides",
        "Conversion optimization",
        "Weekly group coaching",
        "Certificate of completion",
      ],
      modules: [
        "Lead Magnet Creation",
        "Landing Page Mastery",
        "Email Sequences",
        "Paid Traffic Strategies",
        "Conversion Optimization",
        "Automation Setup",
      ],
    },
  ];

  const testimonials = [
    {
      quote: "This program completely changed my approach to marketing. I went from struggling to get clients to having a waitlist.",
      name: "Blessing Okafor",
      title: "Marketing Consultant",
      program: "Digital Marketing Mastery",
      rating: 5,
    },
    {
      quote: "The social media bootcamp was exactly what I needed. My engagement increased by 300% within the first month.",
      name: "Tunde Williams",
      title: "Brand Owner",
      program: "Social Media Bootcamp",
      rating: 5,
    },
    {
      quote: "I implemented the lead generation system and now get 50+ qualified leads every month on autopilot.",
      name: "Amaka Eze",
      title: "Business Coach",
      program: "Lead Generation Blueprint",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Who are these programs for?",
      answer: "These programs are designed for entrepreneurs, business owners, marketing professionals, and anyone who wants to master digital marketing. Whether you're a beginner or have some experience, you'll find value in these courses.",
    },
    {
      question: "How long do I have access to the course materials?",
      answer: "You get lifetime access to all course materials, including any future updates. Once you enroll, you can learn at your own pace and revisit the content anytime.",
    },
    {
      question: "Is there a payment plan available?",
      answer: "Yes! All programs offer flexible payment plans. You can split your payment into 2-3 installments. Contact me for details.",
    },
    {
      question: "What if I'm not satisfied with the program?",
      answer: "I offer a 14-day money-back guarantee. If you're not satisfied with the program within the first 14 days, you can request a full refund.",
    },
    {
      question: "Will I get support during the program?",
      answer: "Absolutely! All programs include access to a private community where you can ask questions and get feedback. Premium programs also include live coaching calls.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-up">
              <Award size={16} className="text-primary" />
              <span className="text-primary text-sm font-medium">Learn From 6+ Years of Experience</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              Master Digital Marketing
              <span className="text-primary block">With Proven Frameworks</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 animate-fade-up animation-delay-200">
              Comprehensive training programs designed to transform you into a skilled digital marketer. 
              Learn the exact strategies I use to help businesses generate millions.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground animate-fade-up animation-delay-300">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <span>1,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={18} className="text-primary" />
                <span>85+ Hours Content</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-primary" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Choose Your Program
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you want a complete transformation or to master a specific skill, 
              there's a program for you.
            </p>
          </div>

          <div className="space-y-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`bg-card border rounded-2xl overflow-hidden ${
                  program.featured ? "border-primary shadow-red" : "border-border"
                }`}
              >
                {program.featured && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    ⭐ Most Popular - Best Value
                  </div>
                )}
                <div className="p-8 md:p-10">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Program Info */}
                    <div className="lg:col-span-2">
                      <span className="text-primary text-sm font-medium">{program.subtitle}</span>
                      <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-2 mb-4">
                        {program.title}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-6">{program.description}</p>

                      <div className="flex flex-wrap gap-6 mb-8">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-primary" />
                          <span className="text-foreground">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-primary" />
                          <span className="text-foreground">{program.students} Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video size={18} className="text-primary" />
                          <span className="text-foreground">{program.format}</span>
                        </div>
                      </div>

                      {/* Modules */}
                      <div className="mb-8">
                        <h4 className="text-sm font-medium text-foreground mb-4">What You'll Learn:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {program.modules.map((module, moduleIndex) => (
                            <div
                              key={moduleIndex}
                              className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                            >
                              <Zap size={14} className="text-primary flex-shrink-0" />
                              <span className="text-foreground">{module}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-4">What's Included:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {program.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-primary flex-shrink-0" />
                              <span className="text-muted-foreground text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="lg:border-l lg:border-border lg:pl-8 flex flex-col justify-center">
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-4xl font-heading font-bold text-foreground">
                            {program.price}
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            {program.originalPrice}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">One-time payment</p>
                      </div>
                      <Button variant="hero" size="xl" className="w-full mb-4">
                        Enroll Now
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                      <p className="text-center text-muted-foreground text-xs">
                        14-day money-back guarantee
                      </p>
                    </div>
                  </div>
                </div>
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
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from students who transformed their marketing skills and businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 bg-background border border-border rounded-xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-heading font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                  <p className="text-primary text-sm mt-1">{testimonial.program}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-card border border-border rounded-xl">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 1,000+ students who have upgraded their marketing skills and grown their businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              Browse Programs
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button variant="outline-dark" size="xl" asChild>
              <Link to="/email-list">Get Free Resources First</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Training;