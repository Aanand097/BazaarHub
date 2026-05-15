import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Deactivate expired banners
    const { data, error } = await supabaseAdmin
      .from("banners")
      .update({ is_active: false, status: "expired" })
      .eq("is_active", true)
      .not("expires_at", "is", null)
      .lt("expires_at", new Date().toISOString())
      .select("id, title");

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, deactivated: data?.length || 0, banners: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
