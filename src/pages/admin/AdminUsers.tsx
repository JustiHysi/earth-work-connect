import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<Map<string, string[]>>(new Map());
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/admin");
        return;
      }

      await fetchUsers();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Error checking permissions");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map user roles
      const rolesMap = new Map<string, string[]>();
      rolesData?.forEach((roleEntry: UserRole) => {
        const existing = rolesMap.get(roleEntry.user_id) || [];
        rolesMap.set(roleEntry.user_id, [...existing, roleEntry.role]);
      });
      setUserRoles(rolesMap);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to load users");
    }
  };

  const hasNgoRole = (userId: string) => {
    return userRoles.get(userId)?.includes('ngo') || false;
  };

  const hasAdminRole = (userId: string) => {
    return userRoles.get(userId)?.includes('admin') || false;
  };

  const toggleNgoAccess = async (userId: string, currentlyHasNgo: boolean) => {
    setUpdatingRole(userId);
    try {
      if (currentlyHasNgo) {
        // Revoke NGO access
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'ngo');

        if (error) throw error;
        toast.success("NGO access revoked");
      } else {
        // Grant NGO access
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'ngo' });

        if (error) throw error;
        toast.success("NGO access granted");
      }

      // Refresh user roles
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdatingRole(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">All Users</h2>
          <p className="text-muted-foreground">Manage and verify platform users</p>
        </div>

        <div className="grid gap-4">
          {users.map((user) => {
            const isNgo = hasNgoRole(user.id);
            const isAdmin = hasAdminRole(user.id);
            const isUpdating = updatingRole === user.id;

            return (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.full_name || 'No name'}</CardTitle>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={user.role === 'ngo' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      {isAdmin && (
                        <Badge variant="destructive">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {isNgo && (
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          NGO
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                      <span>ID: {user.id.substring(0, 8)}...</span>
                    </div>
                    <Button
                      variant={isNgo ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleNgoAccess(user.id, isNgo)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : isNgo ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Revoke NGO
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Grant NGO
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {users.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
