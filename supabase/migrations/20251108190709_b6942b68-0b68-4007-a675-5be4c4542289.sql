-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('volunteer', 'worker', 'ngo');

-- Create enum for job categories
CREATE TYPE public.job_category AS ENUM (
  'reforestation',
  'clean_energy',
  'resilience',
  'food_security',
  'coastal_protection',
  'water_conservation',
  'green_transport',
  'waste_reduction',
  'biodiversity',
  'water_quality'
);

-- Create enum for job urgency
CREATE TYPE public.job_urgency AS ENUM ('high', 'medium', 'low');

-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role public.user_role NOT NULL DEFAULT 'volunteer',
  location TEXT,
  skills TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.job_category NOT NULL,
  urgency public.job_urgency NOT NULL DEFAULT 'medium',
  status public.job_status NOT NULL DEFAULT 'open',
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  pay_per_day NUMERIC(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  impact_description TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Anyone can view open jobs"
  ON public.jobs FOR SELECT
  USING (status = 'open' OR auth.uid() = created_by);

CREATE POLICY "NGOs can create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ngo'
    )
  );

CREATE POLICY "Job creators can update their jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Job creators can delete their jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = created_by);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Enable RLS on job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Job applications policies
CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = applicant_id OR auth.uid() IN (
    SELECT created_by FROM public.jobs WHERE id = job_id
  ));

CREATE POLICY "Workers and volunteers can create applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Job creators can update application status"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() IN (
    SELECT created_by FROM public.jobs WHERE id = job_id
  ));

-- Create impact stats table
CREATE TABLE public.impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  trees_planted INTEGER NOT NULL DEFAULT 0,
  co2_offset_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
  jobs_completed INTEGER NOT NULL DEFAULT 0,
  earnings_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on impact_stats
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

-- Impact stats policies
CREATE POLICY "Users can view their own stats"
  ON public.impact_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.impact_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.impact_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_stats_updated_at
  BEFORE UPDATE ON public.impact_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.impact_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert seed data for jobs
INSERT INTO public.jobs (title, description, category, urgency, location_name, latitude, longitude, pay_per_day, duration_days, impact_description)
VALUES
  ('Urban Tree Planting Initiative', 'Help plant 500 indigenous trees in urban areas to combat air pollution and provide shade.', 'reforestation', 'high', 'Nairobi, Kenya', -1.2921, 36.8219, 15, 3, '50 kg CO₂ offset per tree planted'),
  ('Solar Panel Cleaning & Maintenance', 'Clean and inspect solar panels at community energy installations to maximize efficiency.', 'clean_energy', 'medium', 'Rajasthan, India', 27.0238, 74.2179, 20, 5, '15% efficiency increase'),
  ('Flood Prevention Drainage Work', 'Clear drainage systems and reinforce flood barriers to protect vulnerable communities.', 'resilience', 'high', 'Manila, Philippines', 14.5995, 120.9842, 18, 7, 'Protects 200+ households'),
  ('Community Garden Setup', 'Build raised beds and irrigation systems for local food production in urban areas.', 'food_security', 'medium', 'São Paulo, Brazil', -23.5505, -46.6333, 12, 4, 'Feeds 50+ families monthly'),
  ('Wind Turbine Inspection', 'Assist technicians with visual inspections and basic maintenance of wind turbines.', 'clean_energy', 'low', 'Cape Town, South Africa', -33.9249, 18.4241, 25, 2, 'Powers 100+ homes'),
  ('Mangrove Restoration Project', 'Plant mangrove seedlings to restore coastal ecosystems and protect against storm surge.', 'coastal_protection', 'high', 'Khulna, Bangladesh', 22.8456, 89.5403, 14, 6, '85 kg CO₂ offset per mangrove'),
  ('Rainwater Harvesting Installation', 'Install rainwater collection systems in schools and community centers.', 'water_conservation', 'medium', 'Lima, Peru', -12.0464, -77.0428, 16, 3, '5000L water saved monthly'),
  ('Bicycle Repair Hub Assistant', 'Help maintain and repair bicycles to promote sustainable urban transportation.', 'green_transport', 'low', 'Amsterdam, Netherlands', 52.3676, 4.9041, 22, 5, 'Reduces 100kg CO₂/month'),
  ('Compost Facility Operations', 'Sort organic waste and maintain composting systems for local agriculture.', 'waste_reduction', 'medium', 'Accra, Ghana', 5.6037, -0.1870, 13, 4, '2 tons waste diverted weekly'),
  ('Rooftop Solar Installation Support', 'Assist qualified installers with rooftop solar panel installation for low-income housing.', 'clean_energy', 'high', 'Mexico City, Mexico', 19.4326, -99.1332, 18, 3, 'Powers 5 homes per installation'),
  ('Urban Bee Habitat Creation', 'Build and install bee hotels and pollinator gardens in urban spaces.', 'biodiversity', 'low', 'London, UK', 51.5074, -0.1278, 17, 2, 'Supports 1000+ pollinators'),
  ('River Cleanup Initiative', 'Remove plastic waste and debris from urban waterways to improve ecosystem health.', 'water_quality', 'high', 'Jakarta, Indonesia', -6.2088, 106.8456, 11, 4, '500kg plastic removed');