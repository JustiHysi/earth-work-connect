import { Card } from "@/components/ui/card";
import { TreePine, Droplets, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface StatProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
}

const AnimatedStat = ({ icon, value, label, suffix }: StatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-card border-border">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">{icon}</div>
      </div>
      <div className="text-4xl font-bold text-foreground mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </Card>
  );
};

export const ImpactStats = () => {
  return (
    <section className="py-16 bg-muted/50" id="impact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Global Impact</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real people, real change. See how our community is making a difference worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedStat
            icon={<TreePine className="h-8 w-8" />}
            value={15420}
            label="Trees Planted"
            suffix=""
          />
          <AnimatedStat
            icon={<Droplets className="h-8 w-8" />}
            value={850}
            label="CO₂ Offset (tons)"
            suffix=""
          />
          <AnimatedStat
            icon={<Users className="h-8 w-8" />}
            value={3200}
            label="Active Workers"
            suffix="+"
          />
          <AnimatedStat
            icon={<Zap className="h-8 w-8" />}
            value={12500}
            label="Jobs Completed"
            suffix="+"
          />
        </div>
      </div>
    </section>
  );
};
