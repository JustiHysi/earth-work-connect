import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TreePine, Users, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("about.subscribeSuccess"));
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">{t('about.title')}</h1>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('about.mission')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.missionText')}
            </p>
          </section>

          <section className="mb-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="text-2xl font-bold text-primary mb-3">{t('about.sdg')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.sdgText')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-8">{t('about.howItWorks')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('about.step1Title')}</h3>
                <p className="text-muted-foreground">{t('about.step1Text')}</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('about.step2Title')}</h3>
                <p className="text-muted-foreground">{t('about.step2Text')}</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('about.step3Title')}</h3>
                <p className="text-muted-foreground">{t('about.step3Text')}</p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('about.joinMovement')}</h2>
            <p className="text-muted-foreground mb-6">{t('about.newsletter')}</p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
              <Input
                type="email"
                placeholder={t('about.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit">{t('about.subscribe')}</Button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
