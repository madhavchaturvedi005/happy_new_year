-- Create table to store visitor names and their wishes
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_meaning TEXT,
  personalized_wish TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can insert visitors"
ON public.visitors
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read (for analytics - you can restrict this later)
CREATE POLICY "Anyone can read visitors"
ON public.visitors
FOR SELECT
USING (true);