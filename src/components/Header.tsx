import { Button } from "@/components/ui/button";
import { Globe, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <a href="#jobs" className="text-foreground hover:text-primary transition-colors font-medium">
        Browse Jobs
      </a>
      <a href="#impact" className="text-foreground hover:text-primary transition-colors font-medium">
        Our Impact
      </a>
      <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
        About
      </a>
    </>
  );

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Work<span className="text-primary">4</span>Earth
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
          <Button variant="default" size="sm">
            Get Started
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              <NavLinks />
              <Button variant="default" className="w-full">
                Get Started
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
