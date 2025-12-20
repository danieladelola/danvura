const About = () => {
  const stats = [
    { number: "5+", label: "Years Experience" },
    { number: "50+", label: "Projects Completed" },
    { number: "30+", label: "Happy Clients" },
  ];

  return (
    <section id="about" className="section-padding bg-secondary">
      <div className="container-wide mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-primary font-medium mb-4">About Me</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight mb-6">
              Building brands that connect and convert
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                I'm a digital marketer and brand builder based in Nigeria, working with business owners 
                and founders who want to grow their presence online.
              </p>
              <p>
                My approach is simple: understand your business deeply, craft messaging that resonates 
                with your audience, and execute strategies that deliver real results.
              </p>
              <p>
                Whether you're launching a new brand or scaling an existing one, I help you cut through 
                the noise and build a presence that earns trust and drives growth.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-background rounded-lg shadow-soft"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
