-- Recreate the view without SECURITY DEFINER to fix linter warning
-- The view was implicitly created with SECURITY DEFINER, we need to ensure it's created with SECURITY INVOKER

DROP VIEW IF EXISTS public.public_profiles;

-- Create the safe public view with SECURITY INVOKER (default, safer option)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  full_name,
  location,
  skills,
  role,
  created_at,
  updated_at
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Add helpful comment
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles without sensitive email addresses. Use this for browsing workers/NGOs for job matching.';