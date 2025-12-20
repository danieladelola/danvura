const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-foreground text-background">
      <div className="container-wide mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="#" className="font-heading font-bold text-xl">
            Daniel<span className="text-primary">.</span>
          </a>
          <p className="text-background/60 text-sm">
            © {currentYear} Daniel Adelola. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-background/60 hover:text-primary transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors text-sm">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
