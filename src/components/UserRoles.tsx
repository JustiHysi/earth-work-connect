import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Briefcase, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getRoles = (t: any) => [
  {
    icon: <UserCircle className="h-12 w-12" />,
    title: t('userRoles.volunteer.title'),
    description: t('userRoles.volunteer.description'),
    features: [t('userRoles.volunteer.feature1'), t('userRoles.volunteer.feature2'), t('userRoles.volunteer.feature3'), t('userRoles.volunteer.feature4')],
    cta: t('userRoles.volunteer.cta'),
    roleValue: "volunteer"
  },
  {
    icon: <Briefcase className="h-12 w-12" />,
    title: t('userRoles.worker.title'),
    description: t('userRoles.worker.description'),
    features: [t('userRoles.worker.feature1'), t('userRoles.worker.feature2'), t('userRoles.worker.feature3'), t('userRoles.worker.feature4')],
    cta: t('userRoles.worker.cta'),
    roleValue: "worker"
  },
  {
    icon: <Building2 className="h-12 w-12" />,
    title: t('userRoles.ngo.title'),
    description: t('userRoles.ngo.description'),
    features: [t('userRoles.ngo.feature1'), t('userRoles.ngo.feature2'), t('userRoles.ngo.feature3'), t('userRoles.ngo.feature4')],
    cta: t('userRoles.ngo.cta'),
    roleValue: "ngo"
  }
];

export const UserRoles = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const roles = getRoles(t);

  return (
    <section className="py-16 bg-background" id="about">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('userRoles.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('userRoles.subtitle')}
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
