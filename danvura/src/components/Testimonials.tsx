import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Daniel transformed our online presence. His strategic approach to branding helped us connect with our ideal customers and grow our business significantly.",
      name: "Adaeze Okonkwo",
      title: "Founder, Lumina Fashion",
    },
    {
      quote:
        "Working with Daniel was a game-changer. He understood our vision and delivered a marketing strategy that actually works. Our leads have tripled.",
      name: "Emeka Nwachukwu",
      title: "CEO, TechBridge Solutions",
    },
    {
      quote:
        "Professional, creative, and results-driven. Daniel helped us build a brand that our customers trust and love. Highly recommended.",
      name: "Funke Adeleke",
      title: "Managing Director, GreenLeaf Foods",
    },
  ];

  return (
    <section id="testimonials" className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-medium mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            What clients say
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take my word for it. Here's what business owners have to say about working together.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-secondary rounded-lg relative"
            >
              <Quote size={40} className="text-primary/20 absolute top-6 right-6" />
              <p className="text-foreground text-lg mb-8 relative z-10">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-heading font-bold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {testimonial.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
