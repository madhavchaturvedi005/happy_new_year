-- =====================================================
-- New Year Wishes App - Complete Database Schema
-- =====================================================
-- Run this in your Supabase SQL Editor to set up the complete database

-- 1. Create the main visitors table
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_meaning TEXT,
  personalized_wish TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger for automatic updated_at
DROP TRIGGER IF EXISTS handle_visitors_updated_at ON public.visitors;
CREATE TRIGGER handle_visitors_updated_at
  BEFORE UPDATE ON public.visitors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for visitors table
DROP POLICY IF EXISTS "Anyone can insert visitors" ON public.visitors;
DROP POLICY IF EXISTS "Anyone can read visitors" ON public.visitors;

CREATE POLICY "Anyone can insert visitors"
ON public.visitors
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read visitors"
ON public.visitors
FOR SELECT
USING (true);

-- 6. Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('visitor-photos', 'visitor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Create storage policies
DROP POLICY IF EXISTS "Anyone can upload visitor photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view visitor photos" ON storage.objects;

CREATE POLICY "Anyone can upload visitor photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'visitor-photos');

CREATE POLICY "Anyone can view visitor photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'visitor-photos');

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON public.visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_name ON public.visitors(name);

-- 9. Create analytics view
CREATE OR REPLACE VIEW public.visitor_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_visitors,
  COUNT(photo_url) as visitors_with_photos,
  ARRAY_AGG(name ORDER BY created_at) as names
FROM public.visitors
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 10. Grant permissions
GRANT SELECT ON public.visitor_stats TO anon, authenticated;

-- =====================================================
-- Schema Summary:
-- =====================================================
-- 
-- Tables:
-- - visitors: Stores visitor names, meanings, wishes, and photo URLs
--
-- Columns in visitors table:
-- - id: UUID primary key (auto-generated)
-- - name: TEXT - The visitor's name (required)
-- - name_meaning: TEXT - AI-generated meaning of the name
-- - personalized_wish: TEXT - AI-generated personalized wish
-- - photo_url: TEXT - URL to uploaded photo in storage
-- - created_at: TIMESTAMP - When record was created
-- - updated_at: TIMESTAMP - When record was last updated
--
-- Storage:
-- - visitor-photos bucket: Public bucket for storing uploaded photos
--
-- Security:
-- - Row Level Security enabled
-- - Public read/write access (suitable for public greeting app)
-- - Anyone can upload and view photos
--
-- Performance:
-- - Indexes on created_at and name columns
-- - Analytics view for visitor statistics
-- =====================================================