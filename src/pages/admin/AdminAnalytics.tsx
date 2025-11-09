import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, Briefcase, TreePine } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface AnalyticsData {
  totalUsers: number;
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
  acceptedApplications: number;
  pendingApplications: number;
  totalImpact: number;
  avgJobsPerUser: number;
}

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalJobs: 0,
    openJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    totalImpact: 0,
    avgJobsPerUser: 0,
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

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/admin");
        return;
      }

      await fetchAnalytics();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Error checking permissions");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [profilesRes, jobsRes, appsRes, impactRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id, status', { count: 'exact' }),
        supabase.from('job_applications').select('id, status', { count: 'exact' }),
        supabase.from('impact_stats').select('trees_planted'),
      ]);

      const totalUsers = profilesRes.count || 0;
      const totalJobs = jobsRes.count || 0;
      const openJobs = jobsRes.data?.filter(j => j.status === 'open').length || 0;
      const completedJobs = jobsRes.data?.filter(j => j.status === 'completed').length || 0;
      const cancelledJobs = jobsRes.data?.filter(j => j.status === 'cancelled').length || 0;
      const inProgressJobs = jobsRes.data?.filter(j => j.status === 'in_progress').length || 0;
      const closedJobs = completedJobs + cancelledJobs;
      const totalApplications = appsRes.count || 0;
      const acceptedApplications = appsRes.data?.filter(a => a.status === 'accepted').length || 0;
      const pendingApplications = appsRes.data?.filter(a => a.status === 'pending').length || 0;
      const totalImpact = impactRes.data?.reduce((sum, stat) => sum + stat.trees_planted, 0) || 0;

      setAnalytics({
        totalUsers,
        totalJobs,
        openJobs,
        closedJobs,
        totalApplications,
        acceptedApplications,
        pendingApplications,
        totalImpact,
        avgJobsPerUser: totalUsers > 0 ? Number((totalJobs / totalUsers).toFixed(2)) : 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error("Failed to load analytics");
    }
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
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Platform Analytics</h2>
          <p className="text-muted-foreground">Detailed insights and statistics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered on platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.openJobs}</div>
              <p className="text-xs text-muted-foreground">Out of {analytics.totalJobs} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Closed Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.closedJobs}</div>
              <p className="text-xs text-muted-foreground">Completed or cancelled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalApplications}</div>
              <p className="text-xs text-muted-foreground">All job applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accepted Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.acceptedApplications}</div>
              <p className="text-xs text-muted-foreground">Successfully matched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Environmental Impact</CardTitle>
              <TreePine className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalImpact}</div>
              <p className="text-xs text-muted-foreground">Trees planted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Jobs per User</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgJobsPerUser}</div>
              <p className="text-xs text-muted-foreground">Platform engagement</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm">Job Acceptance Rate</span>
              <span className="font-bold">
                {analytics.totalApplications > 0
                  ? `${((analytics.acceptedApplications / analytics.totalApplications) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm">Jobs per User Ratio</span>
              <span className="font-bold">{analytics.avgJobsPerUser}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm">Active Jobs Percentage</span>
              <span className="font-bold">
                {analytics.totalJobs > 0
                  ? `${((analytics.openJobs / analytics.totalJobs) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
