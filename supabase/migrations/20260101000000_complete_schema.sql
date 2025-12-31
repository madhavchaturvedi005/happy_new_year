-- Complete schema for New Year Wishes App
-- This migration ensures all necessary tables and policies are in place

-- Create visitors table (if not exists)
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_meaning TEXT,
  personalized_wish TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at (if not exists)
DROP TRIGGER IF EXISTS handle_visitors_updated_at ON public.visitors;
CREATE TRIGGER handle_visitors_updated_at
  BEFORE UPDATE ON public.visitors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert visitors" ON public.visitors;
DROP POLICY IF EXISTS "Anyone can read visitors" ON public.visitors;

-- Create policies
CREATE POLICY "Anyone can insert visitors"
ON public.visitors
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read visitors"
ON public.visitors
FOR SELECT
USING (true);

-- Create storage bucket for visitor photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('visitor-photos', 'visitor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can upload visitor photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view visitor photos" ON storage.objects;

-- Create storage policies
CREATE POLICY "Anyone can upload visitor photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'visitor-photos');

CREATE POLICY "Anyone can view visitor photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'visitor-photos');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON public.visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_name ON public.visitors(name);

-- Create a view for analytics (optional)
CREATE OR REPLACE VIEW public.visitor_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_visitors,
  COUNT(photo_url) as visitors_with_photos
FROM public.visitors
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant permissions on the view
GRANT SELECT ON public.visitor_stats TO anon, authenticated;