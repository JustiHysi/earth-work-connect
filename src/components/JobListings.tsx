import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, DollarSign, Search, TreePine, Sun, Droplets, Wrench, Leaf, Wind } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  location_name: string;
  category: string;
  pay_per_day: number;
  duration_days: number;
  description: string;
  impact_description: string;
  urgency: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  reforestation: <TreePine className="h-5 w-5" />,
  clean_energy: <Sun className="h-5 w-5" />,
  resilience: <Droplets className="h-5 w-5" />,
  food_security: <Leaf className="h-5 w-5" />,
  coastal_protection: <TreePine className="h-5 w-5" />,
  water_conservation: <Droplets className="h-5 w-5" />,
  green_transport: <Wrench className="h-5 w-5" />,
  waste_reduction: <Leaf className="h-5 w-5" />,
  biodiversity: <Leaf className="h-5 w-5" />,
  water_quality: <Droplets className="h-5 w-5" />,
};

export const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Reforestation", "Clean Energy", "Resilience", "Food Security", "Coastal Protection", "Water Conservation", "Green Transport", "Waste Reduction", "Biodiversity", "Water Quality"];

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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                           job.category.replace('_', ' ').toLowerCase() === selectedCategory.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesCategory;
  });

  const urgencyColors: Record<string, string> = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-accent text-accent-foreground",
    low: "bg-success text-success-foreground"
  };

  if (loading) {
    return (
      <section className="py-16 bg-background" id="jobs">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background" id="jobs">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Available Micro-Jobs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find verified environmental opportunities near you. Every job makes a measurable impact.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-xl transition-all border-border hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {categoryIcons[job.category] || <TreePine className="h-5 w-5" />}
                  </div>
                  <Badge className={urgencyColors[job.urgency]}>
                    {job.urgency} priority
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">{job.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.location_name}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-success">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">${job.pay_per_day}/day</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{job.duration_days} days</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="text-sm font-medium text-primary">
                    Impact: {job.impact_description}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No jobs found matching your search. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
