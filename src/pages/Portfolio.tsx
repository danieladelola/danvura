import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { usePortfolioItems } from "@/hooks/usePortfolioItems";
import { PortfolioCategory } from "@/types/blog";

type PortfolioFilter = PortfolioCategory | 'All';

const Portfolio = () => {
  const { getItemsByCategory } = usePortfolioItems();
  const [selectedIndustry, setSelectedIndustry] = useState<PortfolioFilter>("All");

  const media = getItemsByCategory(selectedIndustry);

  // Preload images for instant display
  useEffect(() => {
    media.forEach((item) => {
      if (item.mediaType === 'image') {
        const img = new Image();
        img.src = item.mediaUrl;
      }
    });
  }, [media]);

  const industries: PortfolioFilter[] = [
    "All",
    "Brand Design",
    "Web Designs",
    "Video Creation/editing",
    "Influencer",
    "AdvertIsing",
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

      {/* Filter */}
      <section className="py-8">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="flex flex-wrap gap-4">
            {industries.map((industry, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedIndustry === industry
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {media
              .map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                {item.mediaType === 'image' ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300" loading="eager" />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                      <img 
                        src={item.mediaUrl} 
                        alt={item.title} 
                        className="w-full h-full object-contain max-h-[85vh]" 
                        loading="eager"
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <video src={item.mediaUrl} className="w-full aspect-[9/16] object-cover" controls />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="py-16 bg-black">
        <div className="container-wide mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              Brands I've Worked With
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Trusted by leading brands across various industries
            </p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/11fab788be9d356bd8f8b622c54006eb.jpg" 
                alt="Brand Logo 1" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/EEDSL-SP-Logo-white-scaled.jpeg" 
                alt="Brand Logo 2" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/afrisafe-logo-2025-3.png" 
                alt="Brand Logo 3" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/guddx0v0_400x400.jpg" 
                alt="Brand Logo 4" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/1630478076101.jpg" 
                alt="Brand Logo 5" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/images (1).jpg" 
                alt="Brand Logo 6" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/images.jpg" 
                alt="Brand Logo 7" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/images.png" 
                alt="Brand Logo 8" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/green.png" 
                alt="Brand Logo 9" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/launch_image.jpeg" 
                alt="Brand Logo 10" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/seplat.jpg" 
                alt="Brand Logo 11" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/media/brandlogo/vura.jpg" 
                alt="Brand Logo 12" 
                className="w-24 h-24 object-contain rounded-full hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
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