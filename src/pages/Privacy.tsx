import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-5xl font-bold text-foreground mb-2">{t('privacy.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('privacy.lastUpdated')}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.intro')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.introText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.collection')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.collectionText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.usage')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.usageText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.sharing')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.sharingText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.security')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.securityText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.rights')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.rightsText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.cookies')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.cookiesText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('privacy.contact')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('privacy.contactText')}</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
