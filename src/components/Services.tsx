import { Megaphone, Palette, TrendingUp, Users } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: "Brand Strategy",
      description:
        "Develop a clear brand identity that sets you apart. From positioning to messaging, I help you build a brand that resonates.",
    },
    {
      icon: Megaphone,
      title: "Digital Marketing",
      description:
        "Strategic campaigns across social media, email, and paid ads. Data-driven approaches that maximize your marketing ROI.",
    },
    {
      icon: TrendingUp,
      title: "Growth Marketing",
      description:
        "Scale your business with proven growth strategies. From lead generation to customer acquisition, I focus on sustainable growth.",
    },
    {
      icon: Users,
      title: "Social Media Management",
      description:
        "Build an engaged community around your brand. Consistent content, community management, and growth strategies.",
    },
  ];

  return (
    <section id="services" className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-medium mb-4">What I Do</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Services that drive results
          </h2>
          <p className="text-lg text-muted-foreground">
            I offer focused services designed to help your business grow and thrive in the digital space.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 bg-background border border-border rounded-lg hover:border-primary/50 hover:shadow-medium transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
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
      </div>
    </section>
  );
};

export default Services;
