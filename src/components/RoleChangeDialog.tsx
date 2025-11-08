import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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

  const canChangeRole = () => {
    if (!roleChangedAt) return true;
    
    const lastChanged = new Date(roleChangedAt);
    const now = new Date();
    const daysSinceChange = (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceChange >= 7;
  };

  const getDaysUntilChange = () => {
    if (!roleChangedAt) return 0;
    
    const lastChanged = new Date(roleChangedAt);
    const now = new Date();
    const daysSinceChange = (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, Math.ceil(7 - daysSinceChange));
  };

  const handleRoleChange = async () => {
    if (!canChangeRole()) {
      toast.error(`You can change your role in ${getDaysUntilChange()} days`);
      return;
    }

    if (selectedRole === currentRole) {
      toast.info("Please select a different role");
      return;
    }

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

      toast.success("Role changed successfully!");
      onRoleChanged();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error changing role:', error);
      toast.error("Failed to change role");
    } finally {
      setIsChanging(false);
    }
  };

  const roleOptions = [
    { value: 'volunteer', label: 'Volunteer', description: 'Help environmental causes' },
    { value: 'worker', label: 'Worker', description: 'Earn while making an impact' },
    { value: 'ngo', label: 'NGO', description: 'Post environmental jobs' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Your Role</DialogTitle>
          <DialogDescription>
            {canChangeRole() 
              ? "Select a new role. You can change it again in 7 days."
              : `You can change your role in ${getDaysUntilChange()} days.`
            }
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-4">
          {roleOptions.map((option) => (
            <div 
              key={option.value} 
              className={`flex items-start space-x-3 border rounded-lg p-4 transition-colors cursor-pointer ${
                canChangeRole() ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed'
              } ${selectedRole === option.value ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => canChangeRole() && setSelectedRole(option.value)}
            >
              <RadioGroupItem 
                value={option.value} 
                id={option.value} 
                disabled={false}
                className="mt-1"
              />
              <div className="flex-1">
                <Label 
                  htmlFor={option.value} 
                  className={`font-semibold ${canChangeRole() ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  {option.label}
                  {option.value === currentRole && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRoleChange} 
            disabled={!canChangeRole() || isChanging || selectedRole === currentRole}
          >
            {isChanging ? "Changing..." : "Change Role"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
