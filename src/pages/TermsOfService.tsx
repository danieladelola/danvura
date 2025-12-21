import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Daniel Adelola</title>
        <meta name="description" content="Terms of Service for Daniel Adelola's digital marketing services and website." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container-wide mx-auto px-6 md:px-8 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
                Terms of <span className="text-primary">Service</span>
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                Please read these terms carefully before using our digital marketing services.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
              <div className="mb-8 text-center">
                <p className="text-sm text-muted-foreground font-medium">
                  Last updated: December 21, 2025
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Acceptance of Terms
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    By accessing and using Daniel Adelola's website and services, you accept and agree to be bound by
                    the terms and provision of this agreement. If you do not agree to abide by the above, please do
                    not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Services
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11 mb-4">
                    Daniel Adelola provides digital marketing consulting services including but not limited to:
                  </p>
                  <ul className="list-none pl-11 space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Digital marketing strategy development</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Brand development and positioning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Social media marketing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Content marketing and SEO</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Email marketing automation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Paid advertising management</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Marketing analytics and reporting</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    User Responsibilities
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11 mb-4">
                    You agree to:
                  </p>
                  <ul className="list-none pl-11 space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Provide accurate and complete information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Use our services in compliance with applicable laws</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Respect intellectual property rights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Not engage in any harmful or malicious activities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Maintain the confidentiality of any provided materials</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Intellectual Property
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    All content, features, and functionality of our website and services are owned by Daniel Adelola
                    and are protected by copyright, trademark, and other intellectual property laws. You may not
                    reproduce, distribute, or create derivative works without explicit permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Limitation of Liability
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    Daniel Adelola shall not be liable for any indirect, incidental, special, or consequential damages
                    arising out of or in connection with the use of our services. Our total liability shall not exceed
                    the amount paid for the specific service in question.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Payment Terms
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    Payment terms for services will be outlined in individual service agreements. All fees are due
                    as specified in the agreement. Late payments may result in service suspension.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Termination
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    Either party may terminate services with written notice. Upon termination, you remain responsible
                    for all outstanding payments and obligations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Governing Law
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    These terms shall be governed by and construed in accordance with the laws of Nigeria, without
                    regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Changes to Terms
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately
                    upon posting on this page. Your continued use of our services constitutes acceptance of the
                    modified terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Contact Information
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    For questions about these Terms of Service, please contact us at{" "}
                    <a href="mailto:hello@danadelola.com" className="text-primary hover:text-primary/80 font-medium">
                      hello@danadelola.com
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;