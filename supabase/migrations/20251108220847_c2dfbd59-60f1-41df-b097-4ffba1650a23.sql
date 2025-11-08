-- Drop the insecure policy that exposes all emails
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Allow users to see their own full profile (including email)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Create a safe public view without emails for job matching
CREATE OR REPLACE VIEW public.public_profiles AS
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