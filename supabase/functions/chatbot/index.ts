import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch recent jobs for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const jobsResponse = await fetch(`${supabaseUrl}/rest/v1/jobs?select=*&limit=20`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    const jobs = await jobsResponse.json();

    // Build knowledge base context
    const knowledgeBase = `
Work4Earth Knowledge Base:

## About Work4Earth
Work4Earth is a platform connecting volunteers and workers with environmental NGOs to combat climate change through meaningful work opportunities.

## Available Jobs
${jobs.map((job: any) => `
- ${job.title} (${job.location})
  Category: ${job.category}
  Type: ${job.job_type}
  Description: ${job.description}
  Impact: ${job.impact}
  ${job.salary ? `Salary: $${job.salary}` : 'Volunteer position'}
`).join('\n')}

## Payment Information
- Paid positions: Workers receive competitive salaries based on the role and location
- Volunteer positions: No monetary compensation, but valuable experience and contribution to environmental causes
- Payment details are specified in each job listing

## Environmental Impact
- Tree planting: Each tree absorbs approximately 48 pounds (22 kg) of CO2 per year
- Ocean cleanup: Removes harmful plastics and debris from marine ecosystems
- Wildlife conservation: Protects endangered species and biodiversity
- Renewable energy: Reduces carbon emissions and promotes sustainable energy sources

## How to Get Started
1. Browse available jobs on the platform
2. Create an account as a volunteer, worker, or NGO
3. Apply for positions that match your skills and interests
4. Get connected with environmental organizations making a difference

Remember: You're learning from each conversation to provide better answers over time. Use the knowledge base above to answer questions accurately.
`;

    const messages = [
      {
        role: "system",
        content: `You are a helpful Work4Earth assistant. Use the following knowledge base to answer questions accurately and helpfully. If you don't know something, admit it rather than making up information. Be friendly and encouraging about environmental work.

${knowledgeBase}

Previous conversation context: ${JSON.stringify(conversationHistory)}`,
      },
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            response: "I'm experiencing high demand right now. Please try again in a moment.",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            response: "The AI service needs additional credits. Please contact support.",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({
        response: "I'm having trouble right now. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
