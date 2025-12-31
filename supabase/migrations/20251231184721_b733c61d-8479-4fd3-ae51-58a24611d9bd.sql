-- Create storage bucket for visitor photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('visitor-photos', 'visitor-photos', true);

-- Allow anyone to upload photos
CREATE POLICY "Anyone can upload visitor photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'visitor-photos');

-- Allow anyone to view photos (public bucket)
CREATE POLICY "Anyone can view visitor photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'visitor-photos');

-- Add photo_url column to visitors table
ALTER TABLE public.visitors
ADD COLUMN photo_url TEXT;