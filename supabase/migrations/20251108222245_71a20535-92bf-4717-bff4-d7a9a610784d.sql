-- Add role_changed_at column to profiles table to track role changes
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role_changed_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.role_changed_at IS 'Timestamp of the last role change. Users can only change roles once every 7 days.';