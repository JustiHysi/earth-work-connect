import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, AlertCircle, TreePine, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Stats {
  totalUsers: number;
  totalJobs: number;
  pendingApplications: number;
  totalImpact: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalJobs: 0,
    pendingApplications: 0,
    totalImpact: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      await fetchStats();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Error checking permissions");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) throw error;
      
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const statsData = data as any;
        setStats({
          totalUsers: Number(statsData.totalUsers) || 0,
          totalJobs: Number(statsData.totalJobs) || 0,
          pendingApplications: Number(statsData.pendingApplications) || 0,
          totalImpact: Number(statsData.totalImpact) || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error("Failed to load statistics");
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
          <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            {t('dashboard.signOut')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{t('admin.overview')}</h2>
          <p className="text-muted-foreground">Platform statistics and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.totalJobs')}</CardTitle>
              <Briefcase className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.pendingApplications')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.totalImpact')}</CardTitle>
              <TreePine className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImpact}</div>
              <p className="text-xs text-muted-foreground">{t('impact.treesPlanted')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.users')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/users")}>
                {t('admin.verifyUsers')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.jobs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/jobs")}>
                {t('admin.approveJobs')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/analytics")}>
                {t('admin.viewAnalytics')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
