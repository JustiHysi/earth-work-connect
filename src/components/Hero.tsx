import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sprout } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="People working together on environmental projects"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-secondary/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary-foreground/30">
            <Sprout className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            {t('hero.title1')}
            <br />
            <span className="text-secondary-foreground">{t('hero.title2')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.location.href = '/map'}
            >
              <MapPin className="mr-2 h-5 w-5" />
              {t('hero.findJobs')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-14 px-8 bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => window.location.href = '#about'}
            >
              {t('hero.learnMore')}
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
