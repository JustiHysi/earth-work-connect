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

    // Build comprehensive knowledge base
    const knowledgeBase = `
Work4Earth Platform Guide - Your Friendly AI Assistant

## What is Work4Earth? 🌍
Work4Earth is a platform that connects people who want to make a difference with environmental organizations (NGOs) that need help. We bridge the gap between climate action and economic opportunity by offering verified environmental micro-jobs worldwide.

## Who We Help 👥
1. **Workers** - People looking to earn income while helping the environment
2. **Volunteers** - Those who want to contribute their time to environmental causes
3. **NGOs** - Organizations that need help with environmental projects

## What Can I Help You With? 💬
I'm your friendly Work4Earth assistant! I can help you with:

### Finding Jobs 🔍
- "What jobs are available near me?"
- "Show me tree planting opportunities"
- "Are there any paid positions?"
- "What volunteer work can I do?"

### Understanding Impact 🌱
- "How much CO2 does planting a tree offset?"
- "What environmental impact does this job create?"
- "How many trees has the community planted?"

### Getting Started 🚀
- "How do I sign up?"
- "What's the difference between volunteer and worker accounts?"
- "How do I apply for a job?"
- "Do I need special skills?"

### Payment & Earnings 💰
- "How do I get paid?"
- "What are the payment rates?"
- "When will I receive my earnings?"
- "Are volunteer positions unpaid?"

### Platform Features ⚙️
- "How does the job map work?"
- "Can I track my environmental impact?"
- "How do I post a job as an NGO?"

## Current Available Jobs 📋
${jobs.length > 0 ? jobs.map((job: any) => `
🌿 ${job.title} - ${job.location_name}
   📍 Location: ${job.location_name}
   🏷️ Category: ${job.category}
   💵 Pay: $${job.pay_per_day}/day for ${job.duration_days} days
   🌍 Impact: ${job.impact_description}
   📝 ${job.description.substring(0, 100)}...
`).join('\n') : 'No jobs available at the moment. Check back soon!'}

## Quick Facts About Environmental Impact 🌎
- **Tree Planting**: Each tree absorbs about 48 lbs (22 kg) of CO₂ per year. That's like taking a car off the road for a day!
- **Ocean Cleanup**: Removes harmful plastics that take 400+ years to decompose
- **Solar Panel Maintenance**: Helps generate clean energy and reduces reliance on fossil fuels
- **Wildlife Conservation**: Protects endangered species and maintains biodiversity
- **Community Gardens**: Provides fresh food and green spaces for local communities

## How to Get Started (Simple Steps!) 📝
1. **Browse Jobs** - Look through available opportunities on our job board or map
2. **Create Account** - Choose your role: Worker (earn income), Volunteer (contribute time), or NGO (post jobs)
3. **Complete Profile** - Add your location and skills (don't worry, basic skills are fine!)
4. **Apply** - Click "Apply Now" on any job that interests you
5. **Get Matched** - NGOs will review your application and contact you
6. **Make Impact** - Complete jobs, earn money (if paid), and help save the planet!

## Payment Information Made Simple 💳
**For Workers (Paid Positions):**
- You earn daily rates based on the job
- Payment is processed after job completion
- Rates vary by location and job type
- Each job listing shows the exact pay rate

**For Volunteers:**
- No payment, but you gain valuable experience
- Track your environmental impact
- Earn certificates of completion
- Build skills for future opportunities

## Our Global Impact So Far 📊
- 🌳 15,420 Trees Planted
- 💨 850 Tons of CO₂ Offset
- 👥 3,200+ Active Workers
- ✅ 12,500+ Jobs Completed

## Important Note 📢
I'm here to help answer your questions in a friendly, simple way. Don't worry if you're not tech-savvy or new to environmental work - I'll explain everything clearly. If you ask something I don't know, I'll be honest and point you in the right direction!

Remember: Every small action counts. Whether you plant one tree or participate in a large cleanup project, you're making a real difference in fighting climate change! 🌍💚
`;

    const systemPrompt = `You are a friendly, helpful Work4Earth assistant. Your goal is to make environmental action accessible and easy for everyone, regardless of their technical knowledge or experience.

**Communication Style:**
- Be warm, friendly, and encouraging
- Use simple, clear language - avoid jargon
- Break down complex concepts into easy-to-understand explanations
- Use emojis occasionally to be approachable (but don't overdo it)
- Keep responses concise but informative
- Show enthusiasm for environmental work!

**Key Behaviors:**
- If you don't know something specific, say so honestly and suggest where they might find the answer
- When explaining job details, use simple bullet points
- Always encourage users - environmental work is important!
- Personalize responses based on what the user is asking
- Suggest next steps when helpful (e.g., "Would you like me to show you tree planting jobs near you?")

**What to Focus On:**
1. **Job Matching**: Help users find jobs that match their interests and location
2. **Impact Explanation**: Explain environmental impact in relatable terms
3. **Getting Started**: Guide new users through the sign-up and application process
4. **Encouragement**: Motivate users about the positive impact they can make

**Important Guidelines:**
- Never make up job details or payment information - only use the data provided
- If a job listing is missing information, acknowledge it
- Be honest about volunteer vs. paid positions
- Don't promise specific outcomes (like guaranteed job acceptance)

${knowledgeBase}

Previous conversation: ${JSON.stringify(conversationHistory.slice(-5))}`;

    const messages = [
      {
        role: "system",
        content: systemPrompt,
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
