import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 md:pt-0">
      <div className="container-wide mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <p className="text-primary font-medium mb-4 animate-fade-up">
              Digital Marketing & Brand Building
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
              I'm Daniel Adelola
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 animate-fade-up animation-delay-200">
              Helping businesses grow online through marketing and branding that works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">
                  Work With Me
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </Button>
              <Button variant="outline-dark" size="xl" asChild>
                <a href="#work">View My Work</a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-up animation-delay-200">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full bg-secondary overflow-hidden border-4 border-primary/20">
                <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                  <span className="font-heading text-6xl md:text-8xl font-bold text-primary/20">DA</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full opacity-20" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border-4 border-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
