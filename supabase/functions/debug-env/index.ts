import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check all environment variables
    const envVars = {
      OPENAI_API_KEY: Deno.env.get("OPENAI_API_KEY"),
      DATABASE_URL: Deno.env.get("DATABASE_URL"),
      SERVICE_ROLE_KEY: Deno.env.get("SERVICE_ROLE_KEY"),
      SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    };

    const result = {
      message: "Environment Variables Debug",
      variables: Object.entries(envVars).map(([key, value]) => ({
        name: key,
        exists: !!value,
        length: value ? value.length : 0,
        startsWithSk: value ? value.startsWith("sk-") : false,
        preview: value ? `${value.substring(0, 10)}...` : null
      }))
    };

    return new Response(
      JSON.stringify(result, null, 2),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});