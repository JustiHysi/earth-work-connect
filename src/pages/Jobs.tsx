import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobListings } from "@/components/JobListings";
import { useTranslation } from "react-i18next";

const Jobs = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t('jobs.title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('jobs.subtitle')}
          </p>
        </div>
        <JobListings />
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
