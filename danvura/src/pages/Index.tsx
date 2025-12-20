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
      <section className="min-h-screen flex items-center pt-24 lg:pt-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        
        <div className="container-wide mx-auto px-6 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-up">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-sm font-medium tracking-wide">Digital Marketing Expert</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-foreground leading-[1.1] mb-6 animate-fade-up animation-delay-100">
                I Help Businesses
                <span className="text-primary block mt-2">Dominate Online</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl animate-fade-up animation-delay-200">
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

            {/* Photo Area - Standing Rectangle */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-up animation-delay-200">
              <div className="relative">
                {/* Main Photo Container */}
                <div className="w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[420px] lg:w-[340px] lg:h-[450px] rounded-2xl bg-secondary overflow-hidden border border-border/50 shadow-2xl relative group">
                  {/* Placeholder with initials */}
                  <div className="w-full h-full bg-gradient-to-b from-muted via-secondary to-card flex items-center justify-center">
                    <span className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-primary/20">DA</span>
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/20 rounded-2xl -z-10" />
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-primary rounded-full opacity-80" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary/60 rounded-full" />
                <div className="absolute top-1/4 -right-2 w-3 h-3 bg-primary/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50 bg-card/30">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm md:text-base font-medium tracking-wide uppercase">{stat.label}</div>
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

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-8 lg:p-10 bg-card border border-border/50 rounded-2xl hover:border-primary/40 hover:bg-card/80 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-xl lg:text-2xl font-heading font-bold text-foreground mb-4">
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
      <section className="section-padding bg-card/50">
        <div className="container-wide mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">Client Success</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Trusted by Business Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 lg:p-10 bg-background border border-border/50 rounded-2xl relative group hover:border-primary/30 transition-all duration-300">
                {/* Quote mark decoration */}
                <div className="absolute top-6 left-8 text-6xl text-primary/10 font-serif leading-none">"</div>
                <p className="text-foreground text-lg mb-8 leading-relaxed relative z-10 pt-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        
        <div className="container-wide mx-auto relative z-10">
          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-12 md:p-16 lg:p-20 text-center relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/20 blur-3xl" />
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 relative z-10">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
              Join my email list for exclusive marketing insights, or explore my training programs 
              to master digital marketing yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
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