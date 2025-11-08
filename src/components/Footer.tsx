import { Globe, Mail, MapPin, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6" />
              <h3 className="text-xl font-bold">Work4Earth</h3>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Connecting communities to climate-resilient opportunities. Together, we build a sustainable future.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#jobs" className="hover:text-primary-foreground transition-colors">Browse Jobs</a></li>
              <li><a href="#impact" className="hover:text-primary-foreground transition-colors">Our Impact</a></li>
              <li><a href="#about" className="hover:text-primary-foreground transition-colors">Get Started</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Partner With Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@work4earth.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Global Network</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-400 fill-red-400" /> for a sustainable planet
          </p>
          <p className="mt-2">© 2024 Work4Earth. Empowering communities through climate action.</p>
        </div>
      </div>
    </footer>
  );
};
