import { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Profile {
  full_name: string | null;
  email: string;
  location: string | null;
  skills: string[] | null;
  role: string;
}

export const ProfileAvatar = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (!profile) return null;

  const initials = profile.full_name
    ? profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : profile.email[0].toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
          <Avatar className="h-10 w-10 cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {profile.full_name || 'User'}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {profile.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Role
              </p>
              <Badge variant="secondary" className="capitalize">
                {profile.role}
              </Badge>
            </div>

            {profile.location && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Location
                </p>
                <p className="text-sm text-foreground">{profile.location}</p>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
