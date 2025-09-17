import { Github, Twitter, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-foreground/70">
              © {new Date().getFullYear()} FYM — Find Your Movie
            </div>
            <div className="flex items-center gap-4 text-foreground/80">
              <a href="#" className="hover:text-cinema-gold transition-colors" aria-label="Website">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cinema-gold transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cinema-gold transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


