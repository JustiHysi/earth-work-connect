import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImpactStats } from "@/components/ImpactStats";
import { JobListings } from "@/components/JobListings";
import { UserRoles } from "@/components/UserRoles";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ImpactStats />
        <JobListings />
        <UserRoles />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
