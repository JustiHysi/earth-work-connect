import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-5xl font-bold text-foreground mb-2">{t('terms.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('terms.lastUpdated')}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('terms.acceptance')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('terms.acceptanceText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('terms.userAccounts')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('terms.userAccountsText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('terms.jobs')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('terms.jobsText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('terms.payments')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('terms.paymentsText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('terms.conduct')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('terms.conductText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('terms.liability')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('terms.liabilityText')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('terms.changes')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('terms.changesText')}</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
