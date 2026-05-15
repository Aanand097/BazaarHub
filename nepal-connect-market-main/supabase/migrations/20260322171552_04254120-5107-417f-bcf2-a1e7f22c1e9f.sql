-- Fix: realtime already enabled, just add chat_threads to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;