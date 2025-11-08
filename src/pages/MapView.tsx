import { Header } from "@/components/Header";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

const MapView = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t("map.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("map.subtitle")}
          </p>
        </div>
        <InteractiveMap />
      </main>
      <Footer />
    </div>
  );
};

export default MapView;
