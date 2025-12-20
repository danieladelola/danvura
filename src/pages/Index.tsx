import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, Target, Award, ChevronRight } from "lucide-react";

const Index = () => {
  const stats = [
    { number: "6+", label: "Years Experience" },
    { number: "100+", label: "Clients Served" },
    { number: "50M+", label: "Revenue Generated" },
    { number: "500+", label: "Campaigns Launched" },
  ];

  const services = [
    {
      icon: TrendingUp,
      title: "Digital Marketing Strategy",
      description: "Data-driven marketing strategies that increase visibility, engagement, and conversions.",
    },
    {
      icon: Target,
      title: "Brand Positioning",
      description: "Create a powerful brand identity that resonates with your target audience.",
    },
    {
      icon: Users,
      title: "Lead Generation",
      description: "Build systems that consistently attract and convert high-quality leads.",
    },
    {
      icon: Award,
      title: "Growth Consulting",
      description: "Strategic guidance to scale your business to new heights.",
    },
  ];

  const testimonials = [
    {
      quote: "Daniel's strategies helped us 3x our revenue in just 8 months. His expertise in digital marketing is unmatched.",
      name: "Adaeze Okonkwo",
      title: "CEO, Lumina Fashion",
    },
    {
      quote: "Working with Daniel transformed our entire approach to marketing. We now have a predictable lead generation system.",
      name: "Emeka Nwachukwu",
      title: "Founder, TechBridge Solutions",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-up">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-sm font-medium">Digital Marketing Expert</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              I Help Businesses
              <span className="text-primary block">Dominate Online</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-2xl animate-fade-up animation-delay-200">
              With 6+ years of experience, I've helped over 100 businesses build powerful brands 
              and generate millions in revenue through strategic digital marketing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
              <Button variant="hero" size="xl" asChild>
                <Link to="/training">
                  Explore Training Programs
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button variant="outline-dark" size="xl" asChild>
                <Link to="/portfolio">View My Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-5xl font-heading font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium mb-4">What I Do</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
              Strategic Marketing Solutions
            </h2>
            <p className="text-lg text-muted-foreground">
              I help ambitious businesses cut through the noise and build a dominant online presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-8 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-red transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-red transition-all duration-300">
                  <service.icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline-dark" size="lg" asChild>
              <Link to="/about">
                Learn More About My Approach
                <ChevronRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="section-padding bg-card">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium mb-4">Client Success</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
              Trusted by Business Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join my email list for exclusive marketing insights, or explore my training programs 
              to master digital marketing yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/email-list">
                  Join My Email List
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button variant="outline-dark" size="xl" asChild>
                <Link to="/training">View Training Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;