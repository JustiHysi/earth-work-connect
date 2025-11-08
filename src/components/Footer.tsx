import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Work<span className="text-primary">4</span>Earth</h3>
            </div>
            <p className="text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button 
                  onClick={() => handleNavigation("/jobs")} 
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  {t('nav.browseJobs')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/impact")} 
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  {t('nav.ourImpact')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/about")} 
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  {t('footer.about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/contact")} 
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  {t('footer.contact')}
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><button onClick={() => handleNavigation("/privacy")} className="hover:text-primary transition-colors">{t('footer.privacy')}</button></li>
              <li><button onClick={() => handleNavigation("/terms")} className="hover:text-primary transition-colors">{t('footer.terms')}</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
