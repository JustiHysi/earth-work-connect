import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreePine, Droplets, Briefcase, DollarSign, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface ImpactStats {
  trees_planted: number;
  co2_offset_kg: number;
  jobs_completed: number;
  earnings_usd: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ImpactStats | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch impact stats
      const { data: statsData, error: statsError } = await supabase
        .from('impact_stats')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;
      setStats(statsData || { trees_planted: 0, co2_offset_kg: 0, jobs_completed: 0, earnings_usd: 0 });

    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Signed out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/")}>Work4Earth</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.full_name || profile?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("dashboard.signOut")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboard.welcome")}, {profile?.full_name?.split(" ")[0]}!
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.registeredAs")} <span className="font-semibold text-primary capitalize">{profile?.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t("impact.treesPlanted")}</CardTitle>
              <TreePine className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.trees_planted || 0}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.growingFuture")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t("impact.co2Offset")}</CardTitle>
              <Droplets className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.co2_offset_kg || 0} kg</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.carbonReduced")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t("impact.jobsCompleted")}</CardTitle>
              <Briefcase className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.jobs_completed || 0}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.tasksFinished")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalEarnings")}</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.earnings_usd || 0}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.incomeGenerated")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/jobs")}>
                {t("dashboard.browseJobs")}
              </Button>
              <Button variant="outline" onClick={() => navigate("/map")}>
                {t("dashboard.viewMap")}
              </Button>
              {profile?.role === "ngo" && (
                <Button variant="secondary" onClick={() => navigate("/post-job")}>
                  {t("dashboard.postJob")}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
