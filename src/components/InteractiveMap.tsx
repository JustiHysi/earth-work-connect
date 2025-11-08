import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, TreePine } from "lucide-react";

interface Job {
  id: string;
  title: string;
  location_name: string;
  latitude: number;
  longitude: number;
  category: string;
  urgency: string;
  pay_per_day: number;
  duration_days: number;
  impact_description: string;
  description: string;
}

const urgencyColors: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-accent",
  low: "bg-success"
};

export const InteractiveMap = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open');

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="w-full h-[600px] bg-muted rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
          <div className="text-center z-10 p-8">
            <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Interactive Map</h3>
            <p className="text-muted-foreground mb-4">
              View {jobs.length} environmental jobs across the globe
            </p>
            <p className="text-sm text-muted-foreground">
              Map functionality will be available soon with advanced filtering and clustering
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedJob ? (
          <Card className="p-6 sticky top-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">{selectedJob.title}</h3>
              <Badge className={urgencyColors[selectedJob.urgency]}>
                {selectedJob.urgency}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{selectedJob.location_name}</span>
              </div>

              <p className="text-sm text-muted-foreground">{selectedJob.description}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  <div>
                    <div className="text-sm font-semibold">${selectedJob.pay_per_day}/day</div>
                    <div className="text-xs text-muted-foreground">Pay Rate</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">{selectedJob.duration_days} days</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start gap-2 mb-2">
                  <TreePine className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Impact</div>
                    <div className="text-sm text-muted-foreground">{selectedJob.impact_description}</div>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Apply for Job
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 sticky top-4">
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Browse Jobs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {jobs.length} environmental micro-jobs available
              </p>
              <div className="space-y-2">
                {jobs.slice(0, 5).map((job) => (
                  <Button
                    key={job.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setSelectedJob(job)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{job.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};