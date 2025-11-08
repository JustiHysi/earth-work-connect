import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobListings } from "@/components/JobListings";

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse Environmental Jobs</h1>
          <p className="text-xl text-muted-foreground">
            Find meaningful micro-jobs that make a real environmental impact
          </p>
        </div>
        <JobListings />
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
