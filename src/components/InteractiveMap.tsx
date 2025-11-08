import { useEffect, useState, Fragment } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
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

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const urgencyColors: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-accent",
  low: "bg-success"
};

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  
  return null;
}

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
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="w-full h-[600px] rounded-lg shadow-lg z-0"
          scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Fragment>
            {jobs.map((job) => (
              <Marker
                key={job.id}
                position={[job.latitude, job.longitude]}
                icon={customIcon}
                eventHandlers={{ click: () => setSelectedJob(job) }}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">{job.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{job.location_name}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-success">${job.pay_per_day}/day</span>
                      <span>•</span>
                      <span>{job.duration_days} days</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedJob && <RecenterMap lat={selectedJob.latitude} lng={selectedJob.longitude} />}
          </Fragment>
        </MapContainer>
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
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Job</h3>
              <p className="text-sm text-muted-foreground">
                Click on any marker on the map to view job details
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
