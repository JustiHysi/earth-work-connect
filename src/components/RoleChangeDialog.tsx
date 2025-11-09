import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { UserCircle, Briefcase, Building2 } from "lucide-react";

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRole: string;
  roleChangedAt: string | null;
  onRoleChanged: () => void;
}

export function RoleChangeDialog({ 
  open, 
  onOpenChange, 
  currentRole, 
  roleChangedAt,
  onRoleChanged 
}: RoleChangeDialogProps) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isChanging, setIsChanging] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const canChangeRole = () => {
    if (!roleChangedAt) return true;
    
    const lastChanged = new Date(roleChangedAt);
    const now = new Date();
    const daysSinceChange = Math.floor((now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceChange >= 7;
  };

  const getDaysUntilChange = () => {
    if (!roleChangedAt) return 0;
    
    const lastChanged = new Date(roleChangedAt);
    const now = new Date();
    const daysSinceChange = Math.floor((now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, 7 - daysSinceChange);
  };

  const handleRoleSelect = (role: string) => {
    if (!canChangeRole()) {
      toast.error(`You can change your role in ${getDaysUntilChange()} days`);
      return;
    }

    if (role === currentRole) {
      toast.info("This is already your current role");
      return;
    }

    setSelectedRole(role);
    setShowConfirmation(true);
  };

  const handleRoleChange = async () => {
    setIsChanging(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: selectedRole as 'volunteer' | 'worker' | 'ngo',
          role_changed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Role changed successfully! You can change it again in 7 days.");
      onRoleChanged();
      setShowConfirmation(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error changing role:', error);
      toast.error("Failed to change role");
    } finally {
      setIsChanging(false);
    }
  };

  const roleOptions = [
    { 
      value: 'volunteer', 
      label: 'Volunteer', 
      description: 'Help environmental causes',
      icon: <UserCircle className="h-8 w-8" />
    },
    { 
      value: 'worker', 
      label: 'Worker', 
      description: 'Earn while making an impact',
      icon: <Briefcase className="h-8 w-8" />
    },
    { 
      value: 'ngo', 
      label: 'NGO', 
      description: 'Post environmental jobs',
      icon: <Building2 className="h-8 w-8" />
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Change Your Role</DialogTitle>
            <DialogDescription className="text-base">
              {canChangeRole() ? (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  ✓ You can now change your role. Select a new role below.
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ⏳ You can change your role in {getDaysUntilChange()} day{getDaysUntilChange() !== 1 ? 's' : ''}.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {roleOptions.map((option) => {
              const isCurrent = option.value === currentRole;
              const isDisabled = !canChangeRole();
              
              return (
                <button
                  key={option.value}
                  onClick={() => !isDisabled && handleRoleSelect(option.value)}
                  disabled={isDisabled}
                  className={`
                    relative p-6 rounded-lg border-2 transition-all text-left
                    ${selectedRole === option.value ? 'border-primary bg-primary/10 shadow-lg' : 'border-border'}
                    ${!isDisabled ? 'hover:border-primary hover:shadow-lg hover:scale-105 cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                    ${isCurrent ? 'ring-2 ring-primary/30' : ''}
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-full transition-all ${
                      selectedRole === option.value ? 'bg-primary text-primary-foreground scale-110' : 'bg-primary/10 text-primary'
                    }`}>
                      {option.icon}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {option.label}
                      </h3>
                      {isCurrent && (
                        <span className="inline-block text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full mb-2 font-medium">
                          Current Role
                        </span>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Are you sure you want to change your role to <span className="font-semibold capitalize text-foreground">{selectedRole}</span>?</p>
              <p className="text-destructive font-semibold flex items-center gap-2">
                ⚠️ This change cannot be reversed for 7 days!
              </p>
              <p className="text-sm">
                You will need to wait a full week before you can change your role again. Make sure this is the right choice.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChanging}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange} disabled={isChanging}>
              {isChanging ? "Changing..." : "Yes, Change Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
