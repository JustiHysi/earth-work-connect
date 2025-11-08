import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Upload, Calculator, Loader2 } from "lucide-react";

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface LocationMarkerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

interface MapPickerContentProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

function MapPickerContent({ position, setPosition }: MapPickerContentProps) {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </>
  );
}

export const JobPostingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_name: "",
    category: "reforestation",
    urgency: "medium",
    pay_per_day: "",
    duration_days: "",
    impact_description: "",
    photo_url: "",
  });

  const [impactMetrics, setImpactMetrics] = useState({
    trees_planted: 0,
    co2_offset_kg: 0,
    area_covered_sqm: 0,
  });

  // Calculate impact metrics based on category and duration
  useEffect(() => {
    const days = parseInt(formData.duration_days) || 0;
    
    switch (formData.category) {
      case "reforestation":
        setImpactMetrics({
          trees_planted: days * 50, // 50 trees per day
          co2_offset_kg: days * 50 * 21.77, // Each tree offsets ~21.77kg CO2/year
          area_covered_sqm: days * 100,
        });
        break;
      case "clean_energy":
        setImpactMetrics({
          trees_planted: 0,
          co2_offset_kg: days * 150, // 150kg CO2 saved per day
          area_covered_sqm: days * 50,
        });
        break;
      case "waste_reduction":
        setImpactMetrics({
          trees_planted: 0,
          co2_offset_kg: days * 75,
          area_covered_sqm: days * 200,
        });
        break;
      case "resilience":
        setImpactMetrics({
          trees_planted: days * 10,
          co2_offset_kg: days * 25,
          area_covered_sqm: days * 500,
        });
        break;
      case "water_conservation":
        setImpactMetrics({
          trees_planted: 0,
          co2_offset_kg: days * 50,
          area_covered_sqm: days * 300,
        });
        break;
      default:
        setImpactMetrics({
          trees_planted: days * 20,
          co2_offset_kg: days * 40,
          area_covered_sqm: days * 150,
        });
    }
  }, [formData.category, formData.duration_days]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('job-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('job-photos')
        .getPublicUrl(fileName);

      setFormData({ ...formData, photo_url: publicUrl });
      toast.success("Photo uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position) {
      toast.error("Please select a location on the map");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const impactDesc = `Est. ${impactMetrics.trees_planted} trees planted, ${impactMetrics.co2_offset_kg.toFixed(0)}kg CO₂ offset, ${impactMetrics.area_covered_sqm}m² area covered`;

      const { error } = await supabase.from('jobs').insert({
        title: formData.title,
        description: formData.description,
        location_name: formData.location_name,
        latitude: position[0],
        longitude: position[1],
        category: formData.category as any,
        urgency: formData.urgency as any,
        pay_per_day: parseFloat(formData.pay_per_day),
        duration_days: parseInt(formData.duration_days),
        impact_description: formData.impact_description || impactDesc,
        photo_url: formData.photo_url,
        created_by: user.id,
        status: 'open' as any,
      });

      if (error) throw error;

      toast.success("Job posted successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the main details about the job</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g., Community Tree Planting Initiative"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the job requirements, expectations, and goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reforestation">Reforestation</SelectItem>
                  <SelectItem value="clean_energy">Clean Energy</SelectItem>
                  <SelectItem value="waste_reduction">Waste Reduction</SelectItem>
                  <SelectItem value="resilience">Flood Prevention / Resilience</SelectItem>
                  <SelectItem value="water_conservation">Water Conservation</SelectItem>
                  <SelectItem value="coastal_protection">Coastal Protection</SelectItem>
                  <SelectItem value="food_security">Food Security</SelectItem>
                  <SelectItem value="green_transport">Green Transport</SelectItem>
                  <SelectItem value="biodiversity">Biodiversity</SelectItem>
                  <SelectItem value="water_quality">Water Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger id="urgency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pay">Pay Per Day (USD)</Label>
              <Input
                id="pay"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 25.00"
                value={formData.pay_per_day}
                onChange={(e) => setFormData({ ...formData, pay_per_day: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="e.g., 5"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Picker
          </CardTitle>
          <CardDescription>Click on the map to set the job location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location_name">Location Name</Label>
            <Input
              id="location_name"
              placeholder="e.g., Central Park, Tirana"
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              required
            />
          </div>

          <div className="h-[400px] rounded-lg overflow-hidden border">
            <MapContainer
              center={position || [41.3275, 19.8187]}
              zoom={position ? 13 : 8}
              className="h-full w-full">
              <MapPickerContent position={position} setPosition={setPosition} />
            </MapContainer>
          </div>

          {position && (
            <p className="text-sm text-muted-foreground">
              Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Impact Metrics Calculator
          </CardTitle>
          <CardDescription>Estimated environmental impact based on category and duration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{impactMetrics.trees_planted}</div>
              <div className="text-xs text-muted-foreground">Trees Planted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{impactMetrics.co2_offset_kg.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">kg CO₂ Offset</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{impactMetrics.area_covered_sqm}</div>
              <div className="text-xs text-muted-foreground">m² Area Covered</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact">Custom Impact Description (Optional)</Label>
            <Textarea
              id="impact"
              placeholder="Override calculated metrics with custom impact description..."
              value={formData.impact_description}
              onChange={(e) => setFormData({ ...formData, impact_description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Job Photo
          </CardTitle>
          <CardDescription>Upload a photo to showcase the job (max 5MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </p>
            )}
          </div>

          {formData.photo_url && (
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={formData.photo_url}
                alt="Job preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Posting...
            </>
          ) : (
            "Post Job"
          )}
        </Button>
      </div>
    </form>
  );
};