-- Add photo_url column to jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for job photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-photos', 'job-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for job photos
CREATE POLICY "Anyone can view job photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'job-photos');

CREATE POLICY "NGOs can upload job photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'job-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND has_role(auth.uid(), 'ngo'::app_role)
);

CREATE POLICY "NGOs can update their job photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'job-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND has_role(auth.uid(), 'ngo'::app_role)
);

CREATE POLICY "NGOs can delete their job photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'job-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND has_role(auth.uid(), 'ngo'::app_role)
);