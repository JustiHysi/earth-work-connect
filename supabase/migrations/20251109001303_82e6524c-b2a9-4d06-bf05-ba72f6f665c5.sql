-- Create RLS policies allowing admins to view all data
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all impact stats"
ON public.impact_stats
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create secure admin-only RPC function for statistics
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Aggregate statistics
  SELECT json_build_object(
    'totalUsers', (SELECT COUNT(*) FROM profiles),
    'totalJobs', (SELECT COUNT(*) FROM jobs),
    'pendingApplications', (SELECT COUNT(*) FROM job_applications WHERE status = 'pending'),
    'totalImpact', (SELECT COALESCE(SUM(trees_planted), 0) FROM impact_stats)
  ) INTO result;

  RETURN result;
END;
$$;