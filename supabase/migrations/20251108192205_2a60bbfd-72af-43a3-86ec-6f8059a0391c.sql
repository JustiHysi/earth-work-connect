-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'worker', 'volunteer', 'ngo');

-- Create user_roles table with proper security
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::text::app_role
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (true);

-- Update jobs RLS policy to use the new function
DROP POLICY IF EXISTS "NGOs can create jobs" ON public.jobs;
CREATE POLICY "NGOs can create jobs"
  ON public.jobs
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'ngo'));

-- Remove role column from profiles (keep for now for backward compatibility, but we'll phase it out)
-- We'll update this in the next phase after updating all code references