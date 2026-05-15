
-- Admin inquiries/messages table
CREATE TABLE public.admin_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_inquiries ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage inquiries" ON public.admin_inquiries
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Users can read their own received inquiries
CREATE POLICY "Users can view received inquiries" ON public.admin_inquiries
  FOR SELECT TO authenticated
  USING (auth.uid() = receiver_id);

-- Users can mark their own inquiries as read
CREATE POLICY "Users can mark inquiries read" ON public.admin_inquiries
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);
