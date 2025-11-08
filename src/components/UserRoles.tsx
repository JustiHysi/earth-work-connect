import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Briefcase, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: <UserCircle className="h-12 w-12" />,
    title: "Volunteer",
    description: "Contribute your time to environmental causes. Perfect for students and community members.",
    features: ["Browse all jobs", "Track your impact", "Earn certificates", "Join community events"],
    cta: "Start Volunteering",
    roleValue: "volunteer"
  },
  {
    icon: <Briefcase className="h-12 w-12" />,
    title: "Worker",
    description: "Earn income through verified micro-jobs while supporting climate resilience.",
    features: ["Get paid for work", "Flexible scheduling", "Skill development", "Income tracking"],
    cta: "Become a Worker",
    roleValue: "worker"
  },
  {
    icon: <Building2 className="h-12 w-12" />,
    title: "NGO / Organization",
    description: "Post jobs, manage projects, and connect with motivated workers in your region.",
    features: ["Post unlimited jobs", "Worker management", "Impact reporting", "Priority support"],
    cta: "Register Organization",
    roleValue: "ngo"
  }
];

export const UserRoles = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background" id="about">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Join as...</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you want to volunteer, earn income, or create opportunities—there's a place for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="hover:shadow-xl transition-all border-border hover:border-primary/50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    {role.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl text-foreground">{role.title}</CardTitle>
                <CardDescription className="text-base">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => {
                    navigate(`/auth?role=${role.roleValue}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {role.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
