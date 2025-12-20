import { ArrowUpRight } from "lucide-react";

const CaseStudies = () => {
  const projects = [
    {
      title: "E-commerce Brand Launch",
      category: "Brand Strategy + Digital Marketing",
      description:
        "Helped a fashion startup establish their brand identity and launch with a successful digital campaign that generated 500+ customers in the first month.",
      metrics: ["500+ First Month Customers", "3x Social Growth", "45% Engagement Rate"],
    },
    {
      title: "B2B Lead Generation",
      category: "Growth Marketing",
      description:
        "Developed a lead generation system for a consulting firm that consistently delivers qualified leads through LinkedIn and email marketing.",
      metrics: ["150+ Qualified Leads/Month", "40% Email Open Rate", "2x Revenue Growth"],
    },
    {
      title: "Restaurant Chain Rebrand",
      category: "Brand Strategy + Social Media",
      description:
        "Complete rebrand and social media strategy for a local restaurant chain, resulting in increased foot traffic and online orders.",
      metrics: ["80% Brand Awareness Increase", "10K+ New Followers", "35% More Orders"],
    },
  ];

  return (
    <section id="work" className="section-padding bg-foreground text-background">
      <div className="container-wide mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-medium mb-4">Selected Work</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Results that speak for themselves
          </h2>
          <p className="text-lg text-background/70">
            A selection of projects where strategy met execution to deliver real business impact.
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group p-8 md:p-10 bg-background/5 border border-background/10 rounded-lg hover:bg-background/10 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <p className="text-primary font-medium text-sm mb-2">
                    {project.category}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 flex items-center gap-3">
                    {project.title}
                    <ArrowUpRight
                      size={24}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </h3>
                  <p className="text-background/70 text-lg max-w-2xl">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end">
                  {project.metrics.map((metric, metricIndex) => (
                    <span
                      key={metricIndex}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
