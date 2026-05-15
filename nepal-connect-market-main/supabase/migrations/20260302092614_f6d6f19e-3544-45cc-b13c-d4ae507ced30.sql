
-- Banners table for sponsored/promotional ads on homepage
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  link_url text,
  ad_id uuid REFERENCES public.ads(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  starts_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Everyone can view active banners
CREATE POLICY "Active banners viewable by everyone" ON public.banners
FOR SELECT USING (is_active = true);

-- Admins can manage all banners
CREATE POLICY "Admins can manage banners" ON public.banners
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
