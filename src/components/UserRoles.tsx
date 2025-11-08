import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Briefcase, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const handleRoleSelection = async (roleValue: string) => {
    if (!isAuthenticated) {
      navigate(`/auth?role=${roleValue}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSelectedRole(roleValue);
    setShowConfirmDialog(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedRole) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user can change role (7 days restriction)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role_changed_at')
        .eq('id', session.user.id)
        .single();

      if (profile?.role_changed_at) {
        const lastChanged = new Date(profile.role_changed_at);
        const now = new Date();
        const daysSinceChange = Math.floor((now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceChange < 7) {
          const daysRemaining = 7 - daysSinceChange;
          toast({
            title: "Cannot Change Role",
            description: `You can change your role again in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
            variant: "destructive",
          });
          setShowConfirmDialog(false);
          return;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: selectedRole as 'volunteer' | 'worker' | 'ngo',
          role_changed_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `Your role has been changed to ${selectedRole}. You can change it again in 7 days.`,
      });

      setShowConfirmDialog(false);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                  onClick={() => handleRoleSelection(role.roleValue)}
                >
                  {role.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Are you sure you want to change your role to <span className="font-semibold capitalize">{selectedRole}</span>?</p>
                <p className="text-destructive font-medium">
                  ⚠️ This change cannot be reversed for 7 days.
                </p>
                <p className="text-sm">
                  Choose carefully as you'll need to wait a full week before you can change your role again.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRoleChange}>
                Yes, Change Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
};
