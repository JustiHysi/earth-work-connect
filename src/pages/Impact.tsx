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
          <h1 className="text-5xl font-bold text-foreground mb-4">Our Global Impact</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tracking real environmental change through verified micro-jobs. Every tree planted, 
            every solar panel maintained, and every community empowered creates lasting impact.
          </p>
        </div>

        <ImpactStats />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TreePine className="h-6 w-6 text-primary" />
                <CardTitle>Reforestation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our community has planted over 15,000 trees across vulnerable regions, 
                helping to restore ecosystems and combat climate change one sapling at a time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplets className="h-6 w-6 text-primary" />
                <CardTitle>Carbon Offset</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Through clean energy maintenance and waste reduction initiatives, 
                we've offset over 850 tons of CO₂ emissions annually.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Community Empowerment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Over 3,200 workers have earned sustainable income while building 
                climate resilience in their communities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <CardTitle>Global Reach</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Work4Earth operates in 15+ countries, connecting NGOs with local 
                workers to create environmental and economic impact.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle>SDG Alignment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our work directly supports UN Sustainable Development Goal 10 
                (Reduced Inequalities) by providing equal access to dignified work.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle>Growing Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                With 12,500+ jobs completed and counting, our platform continues 
                to scale environmental action across the globe.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-muted/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Turning awareness into action, and data into dignity
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Every number represents a person earning income, a tree growing, or a community 
            becoming more resilient. Join us in creating measurable environmental and social impact.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Impact;