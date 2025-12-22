import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Daniel Adelola</title>
        <meta name="description" content="Privacy Policy for Daniel Adelola's digital marketing services and website." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container-wide mx-auto px-6 md:px-8 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
                Privacy <span className="text-primary">Policy</span>
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                Your privacy is important to us. Learn how I collect, use, and protect your information.
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
                    Information I Collect
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    I collect information you provide directly to me, such as when you subscribe to my email list,
                    fill out contact forms, or engage with my services. This may include your name, email address,
                    phone number, and business information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    How I Use Your Information
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11 mb-4">
                    I use the information I collect to:
                  </p>
                  <ul className="list-none pl-11 space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Provide and improve my digital marketing services</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Send you marketing communications and updates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Respond to your inquiries and support requests</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Analyze my website usage and improve user experience</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">Comply with legal obligations</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Information Sharing
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    I do not sell, trade, or otherwise transfer your personal information to third parties without
                    your consent, except as described in this policy. I may share information with service providers
                    who assist me in operating my website and conducting my business.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Data Security
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    I implement appropriate security measures to protect your personal information against unauthorized
                    access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                    is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Cookies
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    My website uses cookies to enhance your browsing experience, analyze site traffic, and personalize
                    content. You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Your Rights
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    You have the right to access, update, or delete your personal information. You may also opt out
                    of marketing communications at any time. Contact me using the information provided in the footer
                    to exercise these rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Changes to This Policy
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    I may update this Privacy Policy from time to time. I will notify you of any changes by posting
                    the new policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    Contact Me
                  </h2>
                  <p className="text-foreground leading-relaxed pl-11">
                    If you have any questions about this Privacy Policy, please contact me at{" "}
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

export default PrivacyPolicy;