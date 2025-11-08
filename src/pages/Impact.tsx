import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImpactStats } from "@/components/ImpactStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { TreePine, Droplets, Globe, Users, Target, TrendingUp } from "lucide-react";

const Impact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">{t("impact.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("impact.pageDescription")}
          </p>
        </div>

        <ImpactStats />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TreePine className="h-6 w-6 text-primary" />
                <CardTitle>{t("impact.reforestation")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("impact.reforestationDesc")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplets className="h-6 w-6 text-primary" />
                <CardTitle>{t("impact.carbonOffset")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("impact.carbonOffsetDesc")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>{t("impact.communityEmpowerment")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("impact.communityEmpowermentDesc")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <CardTitle>{t("impact.globalReach")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("impact.globalReachDesc")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle>{t("impact.sdgAlignment")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("impact.sdgAlignmentDesc")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle>{t("impact.growingImpact")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("impact.growingImpactDesc")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-muted/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            {t("impact.closingTitle")}
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            {t("impact.closingDesc")}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Impact;