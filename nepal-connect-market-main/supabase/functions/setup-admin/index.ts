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

    const email = "aanandmandal000111@gmail.com";
    const password = "Aanand@097rrr";

    // Check if user exists
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const existing = users?.find((u: any) => u.email === email);

    let userId: string;

    if (existing) {
      userId = existing.id;
    } else {
      // Create user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: "Aanand Mandal" },
      });
      if (error) throw error;
      userId = data.user.id;
    }

    // Ensure admin role exists
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin");

    if (!existingRole || existingRole.length === 0) {
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
    }

    return new Response(JSON.stringify({ success: true, userId }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
