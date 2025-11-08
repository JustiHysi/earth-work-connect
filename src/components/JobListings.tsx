import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, DollarSign, Search, TreePine, Sun, Droplets, Wrench, Leaf, Wind } from "lucide-react";
import { useState } from "react";

interface Job {
  id: number;
  title: string;
  location: string;
  category: string;
  pay: string;
  duration: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  urgency: "high" | "medium" | "low";
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Urban Tree Planting Initiative",
    location: "Nairobi, Kenya",
    category: "Reforestation",
    pay: "$15/day",
    duration: "3 days",
    description: "Help plant 500 indigenous trees in urban areas to combat air pollution and provide shade.",
    impact: "50 kg CO₂ offset per tree planted",
    icon: <TreePine className="h-5 w-5" />,
    urgency: "high"
  },
  {
    id: 2,
    title: "Solar Panel Cleaning & Maintenance",
    location: "Rajasthan, India",
    category: "Clean Energy",
    pay: "$20/day",
    duration: "5 days",
    description: "Clean and inspect solar panels at community energy installations to maximize efficiency.",
    impact: "15% efficiency increase",
    icon: <Sun className="h-5 w-5" />,
    urgency: "medium"
  },
  {
    id: 3,
    title: "Flood Prevention Drainage Work",
    location: "Manila, Philippines",
    category: "Resilience",
    pay: "$18/day",
    duration: "7 days",
    description: "Clear drainage systems and reinforce flood barriers to protect vulnerable communities.",
    impact: "Protects 200+ households",
    icon: <Droplets className="h-5 w-5" />,
    urgency: "high"
  },
  {
    id: 4,
    title: "Community Garden Setup",
    location: "São Paulo, Brazil",
    category: "Food Security",
    pay: "$12/day",
    duration: "4 days",
    description: "Build raised beds and irrigation systems for local food production in urban areas.",
    impact: "Feeds 50+ families monthly",
    icon: <Leaf className="h-5 w-5" />,
    urgency: "medium"
  },
  {
    id: 5,
    title: "Wind Turbine Inspection",
    location: "Cape Town, South Africa",
    category: "Clean Energy",
    pay: "$25/day",
    duration: "2 days",
    description: "Assist technicians with visual inspections and basic maintenance of wind turbines.",
    impact: "Powers 100+ homes",
    icon: <Wind className="h-5 w-5" />,
    urgency: "low"
  },
  {
    id: 6,
    title: "Mangrove Restoration Project",
    location: "Bangladesh",
    category: "Coastal Protection",
    pay: "$14/day",
    duration: "6 days",
    description: "Plant mangrove seedlings to restore coastal ecosystems and protect against storm surge.",
    impact: "85 kg CO₂ offset per mangrove",
    icon: <TreePine className="h-5 w-5" />,
    urgency: "high"
  },
  {
    id: 7,
    title: "Rainwater Harvesting Installation",
    location: "Lima, Peru",
    category: "Water Conservation",
    pay: "$16/day",
    duration: "3 days",
    description: "Install rainwater collection systems in schools and community centers.",
    impact: "5000L water saved monthly",
    icon: <Droplets className="h-5 w-5" />,
    urgency: "medium"
  },
  {
    id: 8,
    title: "Bicycle Repair Hub Assistant",
    location: "Amsterdam, Netherlands",
    category: "Green Transport",
    pay: "$22/day",
    duration: "5 days",
    description: "Help maintain and repair bicycles to promote sustainable urban transportation.",
    impact: "Reduces 100kg CO₂/month",
    icon: <Wrench className="h-5 w-5" />,
    urgency: "low"
  },
  {
    id: 9,
    title: "Compost Facility Operations",
    location: "Accra, Ghana",
    category: "Waste Reduction",
    pay: "$13/day",
    duration: "4 days",
    description: "Sort organic waste and maintain composting systems for local agriculture.",
    impact: "2 tons waste diverted weekly",
    icon: <Leaf className="h-5 w-5" />,
    urgency: "medium"
  },
  {
    id: 10,
    title: "Rooftop Solar Installation Support",
    location: "Mexico City, Mexico",
    category: "Clean Energy",
    pay: "$18/day",
    duration: "3 days",
    description: "Assist qualified installers with rooftop solar panel installation for low-income housing.",
    impact: "Powers 5 homes per installation",
    icon: <Sun className="h-5 w-5" />,
    urgency: "high"
  },
  {
    id: 11,
    title: "Urban Bee Habitat Creation",
    location: "London, UK",
    category: "Biodiversity",
    pay: "$17/day",
    duration: "2 days",
    description: "Build and install bee hotels and pollinator gardens in urban spaces.",
    impact: "Supports 1000+ pollinators",
    icon: <Leaf className="h-5 w-5" />,
    urgency: "low"
  },
  {
    id: 12,
    title: "River Cleanup Initiative",
    location: "Jakarta, Indonesia",
    category: "Water Quality",
    pay: "$11/day",
    duration: "4 days",
    description: "Remove plastic waste and debris from urban waterways to improve ecosystem health.",
    impact: "500kg plastic removed",
    icon: <Droplets className="h-5 w-5" />,
    urgency: "high"
  }
];

export const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Reforestation", "Clean Energy", "Resilience", "Food Security", "Coastal Protection", "Water Conservation", "Green Transport", "Waste Reduction", "Biodiversity", "Water Quality"];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const urgencyColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-accent text-accent-foreground",
    low: "bg-success text-success-foreground"
  };

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
                    {job.icon}
                  </div>
                  <Badge className={urgencyColors[job.urgency]}>
                    {job.urgency} priority
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">{job.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-success">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">{job.pay}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{job.duration}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="text-sm font-medium text-primary">
                    Impact: {job.impact}
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
