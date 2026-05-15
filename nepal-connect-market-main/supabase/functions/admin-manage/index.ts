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

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);
    if (!caller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const { data: callerRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id);
    const isAdmin = callerRoles?.some((r: any) => r.role === "admin");
    if (!isAdmin) return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: corsHeaders });

    const { action, userId, role, message } = await req.json();

    if (action === "delete_user") {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    if (action === "set_role") {
      if (role === "remove") {
        await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
      } else {
        await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
        const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      }
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    if (action === "delete_ad") {
      const { error } = await supabaseAdmin.from("ads").delete().eq("id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    if (action === "send_inquiry") {
      const { error } = await supabaseAdmin.from("admin_inquiries").insert({
        sender_id: caller.id,
        receiver_id: userId,
        message: message,
      });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    if (action === "delete_account_self") {
      // User requesting own account deletion - verify it's actually them
      if (caller.id !== userId) {
        return new Response(JSON.stringify({ error: "Can only delete your own account" }), { status: 403, headers: corsHeaders });
      }
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
