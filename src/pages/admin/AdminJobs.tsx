import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Job {
  id: string;
  title: string;
  description: string;
  location_name: string;
  category: string;
  status: string;
  urgency: string;
  pay_per_day: number;
  duration_days: number;
  created_at: string;
}

export default function AdminJobs() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

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

      await fetchJobs();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Error checking permissions");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error("Failed to load jobs");
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: 'open' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;

      toast.success(`Job status updated to ${newStatus}`);
      await fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error("Failed to update job status");
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
          <h1 className="text-2xl font-bold">Job Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">All Jobs</h2>
          <p className="text-muted-foreground">Review and manage job postings</p>
        </div>

        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                  </div>
                  <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location_name}
                    </span>
                    <span>Category: {job.category}</span>
                    <span>Urgency: {job.urgency}</span>
                    <span>${job.pay_per_day}/day</span>
                    <span>{job.duration_days} days</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {job.status !== 'open' && (
                      <Button
                        size="sm"
                        onClick={() => updateJobStatus(job.id, 'open')}
                      >
                        Open Job
                      </Button>
                    )}
                    {job.status === 'open' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateJobStatus(job.id, 'completed')}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {job.status === 'open' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateJobStatus(job.id, 'cancelled')}
                      >
                        Cancel Job
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No jobs found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
