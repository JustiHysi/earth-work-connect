import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobPostingForm } from "@/components/JobPostingForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasNgoRole, setHasNgoRole] = useState(false);

  useEffect(() => {
    checkNgoAccess();
  }, []);

  const checkNgoAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user has NGO role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'ngo');

      if (!roles || roles.length === 0) {
        navigate('/dashboard');
        return;
      }

      setHasNgoRole(true);
    } catch (error) {
      console.error('Error checking NGO access:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!hasNgoRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Post a New Job</h1>
            <p className="text-xl text-muted-foreground">
              Create an environmental micro-job opportunity for your community
            </p>
          </div>
          <JobPostingForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;