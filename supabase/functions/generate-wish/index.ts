import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface WishRequest {
  name: string;
  photoUrl?: string;
}

interface WishResponse {
  name: string;
  name_meaning: string;
  personalized_wish: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { name, photoUrl }: WishRequest = await req.json();
    
    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Name is required and must be a non-empty string" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const cleanName = name.trim().substring(0, 50);
    console.log(`🎉 Generating New Year wish for: ${cleanName}`);

    // Get environment variables INSIDE the request handler
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const DATABASE_URL = Deno.env.get("DATABASE_URL") || Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("🔍 Environment check:");
    console.log("- OPENAI_API_KEY exists:", !!OPENAI_API_KEY);
    console.log("- OPENAI_API_KEY starts with sk-:", OPENAI_API_KEY?.startsWith("sk-"));
    console.log("- DATABASE_URL exists:", !!DATABASE_URL);
    console.log("- SERVICE_ROLE_KEY exists:", !!SERVICE_ROLE_KEY);

    let wishData: WishResponse;

    // Generate wish using OpenAI or fallback
    if (OPENAI_API_KEY) {
      console.log("🤖 Using OpenAI to generate personalized wish");
      try {
        console.log("📡 Making OpenAI API call...");
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are a warm New Year wishes generator. Create personalized wishes based on name meanings.

Respond in this exact JSON format:
{
  "name_meaning": "Explain the name's meaning and origin in 2-3 sentences.",
  "personalized_wish": "Create a comprehensive New Year 2026 wish that includes:\n\n1. A warm greeting using the name\n2. Connection to the name's meaning\n3. Bullet points with specific wishes:\n\n• Career & Success: [specific wish]\n• Health & Wellness: [specific wish] \n• Relationships & Love: [specific wish]\n• Personal Growth: [specific wish]\n• Dreams & Adventures: [specific wish]\n\n4. End with 'With warm wishes, Madhav'"
}

Make the wish detailed and meaningful (300+ words). Use \\n for line breaks.`
              },
              {
                role: "user",
                content: `Generate a New Year 2026 wish for someone named: ${cleanName}`
              }
            ],
            max_tokens: 800,
            temperature: 0.8,
          }),
        });

        console.log("📊 OpenAI Response Status:", openaiResponse.status);

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error("❌ OpenAI API error:", openaiResponse.status, errorText);
          console.error("❌ Request was:", JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Generate a New Year 2026 wish for someone named: ${cleanName}` }],
            max_tokens: 800
          }));
          throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
        }

        const openaiData = await openaiResponse.json();
        console.log("🎨 OpenAI raw response:", JSON.stringify(openaiData, null, 2));
        
        const content = openaiData.choices?.[0]?.message?.content;

        if (!content) {
          console.error("❌ No content in OpenAI response");
          throw new Error("No content received from OpenAI");
        }

        console.log("📝 OpenAI content:", content);

        // Parse the JSON response
        try {
          const parsedContent = JSON.parse(content);
          console.log("✅ Successfully parsed OpenAI response");
          wishData = {
            name: cleanName,
            name_meaning: parsedContent.name_meaning,
            personalized_wish: parsedContent.personalized_wish,
          };
        } catch (parseError) {
          console.error("❌ Failed to parse OpenAI JSON response:", parseError);
          console.error("❌ Raw content was:", content);
          throw new Error("Invalid response format from AI");
        }

      } catch (openaiError) {
        console.error("❌ OpenAI error, using fallback:", openaiError);
        // Fallback to default wish
        wishData = createFallbackWish(cleanName);
      }
    } else {
      console.log("⚠️ No OpenAI API key found, using fallback wish");
      wishData = createFallbackWish(cleanName);
    }

    // Store in database if Supabase is configured
    if (DATABASE_URL && SERVICE_ROLE_KEY) {
      try {
        console.log("💾 Storing wish in database");
        const supabase = createClient(DATABASE_URL, SERVICE_ROLE_KEY);
        
        const { error: insertError } = await supabase
          .from("visitors")
          .insert({
            name: wishData.name,
            name_meaning: wishData.name_meaning,
            personalized_wish: wishData.personalized_wish,
            photo_url: photoUrl || null,
          });
        
        if (insertError) {
          console.error("❌ Database insert error:", insertError);
        } else {
          console.log("✅ Wish stored successfully in database");
        }
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
        // Don't fail the request if database fails
      }
    } else {
      console.log("⚠️ Database not configured, skipping storage");
    }

    // Return the generated wish
    console.log("🎊 Successfully generated wish for", cleanName);
    return new Response(
      JSON.stringify(wishData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("💥 Unexpected error in generate-wish function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Helper function to create fallback wishes
function createFallbackWish(name: string): WishResponse {
  const fallbackMeanings = [
    `${name} is a beautiful name that represents strength, kindness, and positive energy. It carries the essence of someone who brings light and joy to others.`,
    `${name} carries the essence of joy, wisdom, and wonderful possibilities. It's a name that reflects someone with a caring heart and bright spirit.`,
    `${name} is a name that shines with warmth, creativity, and boundless potential. It represents someone who inspires others and creates positive change.`,
    `${name} embodies grace, determination, and the spirit of new beginnings. It's a name that signifies leadership and compassion.`,
    `${name} is a special name that reflects uniqueness, compassion, and bright dreams. It represents someone destined for great things.`
  ];

  const fallbackWishes = [
    `Dear ${name}, as we step into 2026, your name carries such beautiful energy and meaning. You embody all the wonderful qualities that make this world a brighter place, and I'm excited to see what this new year will bring for someone as special as you.

As we welcome 2026, here are my special wishes for you:

• Career & Success: May your professional journey be filled with exciting opportunities, recognition for your talents, and achievements that exceed your wildest dreams
• Health & Wellness: May you enjoy vibrant health, boundless energy, and the strength to pursue all your passions with enthusiasm and vitality
• Relationships & Love: May your relationships flourish with deep connections, unconditional love, and moments of pure joy shared with those who matter most
• Personal Growth: May you discover new strengths within yourself, embrace challenges as opportunities, and continue evolving into the amazing person you're meant to be
• Dreams & Adventures: May 2026 bring you exciting adventures, the courage to chase your biggest dreams, and the satisfaction of turning your aspirations into reality

Here's to making 2026 your most incredible year yet, filled with love, laughter, and endless possibilities! With warm wishes, Madhav`,

    `Dear ${name}, there's something truly special about your name and the person you are. As we welcome 2026, I want you to know that you have the power to make this year absolutely extraordinary, and I believe in all the wonderful things that await you.

As we welcome 2026, here are my special wishes for you:

• Career & Success: May your work bring you fulfillment, financial abundance, and the satisfaction of making a meaningful impact in everything you do
• Health & Wellness: May you maintain perfect health, find balance in all aspects of life, and have the energy to enjoy every precious moment
• Relationships & Love: May you be surrounded by people who appreciate your uniqueness, support your dreams, and fill your life with laughter and love
• Personal Growth: May you embrace new learning opportunities, develop your talents further, and become even more confident in your abilities
• Dreams & Adventures: May you have the courage to take bold steps toward your goals and experience adventures that create lifelong memories

Wishing you a year of growth, happiness, and boundless joy in everything you do! With warm wishes, Madhav`,

    `Dear ${name}, your name represents so much beauty and potential, just like the person you are. As we enter 2026, I'm filled with excitement thinking about all the wonderful experiences and achievements that await someone as remarkable as you.

As we welcome 2026, here are my special wishes for you:

• Career & Success: May you find your true calling, excel in your chosen field, and be rewarded generously for your dedication and hard work
• Health & Wellness: May you enjoy excellent physical and mental health, find peace in quiet moments, and maintain the vitality to pursue your passions
• Relationships & Love: May your heart be filled with love, your friendships deepen with trust and understanding, and your family bonds grow stronger
• Personal Growth: May you discover hidden talents, overcome any obstacles with grace, and develop the wisdom to make choices that bring you happiness
• Dreams & Adventures: May you embark on journeys that broaden your horizons, achieve goals that once seemed impossible, and create stories worth telling

Here's to a year filled with magic, wonder, and all the beautiful surprises life has to offer! With warm wishes, Madhav`
  ];

  const randomMeaning = fallbackMeanings[Math.floor(Math.random() * fallbackMeanings.length)];
  const randomWish = fallbackWishes[Math.floor(Math.random() * fallbackWishes.length)];

  return {
    name,
    name_meaning: randomMeaning,
    personalized_wish: randomWish,
  };
}