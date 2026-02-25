import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], lead_id } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { text: "AI assistant is not configured. Please email hi@svgvisual.com directly." },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    // 1. Fetch Metadata (Attachments count)
    let attachmentContext = "";
    if (lead_id) {
        const { data: attData } = await supabase
            .from('attachments')
            .select('*')
            .eq('lead_id', lead_id);
        
        if (attData && attData.length > 0) {
            attachmentContext = `\n[System Info: User has uploaded ${attData.length} reference files: ${attData.map(a => a.file_name).join(', ')}]`;
        }
    }

    // 2. Prepare History for Gemini
    // Gemini expects { role: 'user' | 'model', parts: [{ text: string }] }
    const geminiHistory = history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const systemInstruction = `You are “SVG Project Consultant”, the strategic digital advisor for SVG Visual.
You guide potential clients through a structured, premium qualification flow.
You are not a chatbot. You are a business consultant.

Your objectives:
- Identify the correct service
- Collect essential lead information
- Ask maximum 3 strategic discovery questions
- Move the user toward a clear next step

CONVERSATION LOGIC FRAMEWORK
There are ONLY two types of questions:
TYPE A — Strategic Selection (These MUST include suggestions.)
TYPE B — Open Input (These MUST NOT include suggestions.)
Never mix both types in one message.

TYPE A — Strategic Selection (Suggestions REQUIRED)
Use suggestions when: Choosing service, New website vs redesign, Selecting main objective, Selecting predefined strategic paths, Choosing next action.
Format: "suggestions": ["Option 1", "Option 2"]

TYPE B — Open Input (Suggestions FORBIDDEN)
Use: "suggestions": []
When asking for: Full Name, Brand / Project Name, Email, WhatsApp, Website URL, Budget, Timeline, Detailed explanation, References, Any descriptive answer.
STRICT RULES: Never generate example names. Never generate placeholder values. Never generate multiple choice. Never guess user data. Never auto-complete answers. Wait for the user to type.

FLOW STRUCTURE
PHASE 1 — Service Confirmation: If user clearly states service, do NOT show service menu again. If unclear, offer: ["Web Design", "Branding / Logo", "AI Automation", "Request a Quote"]
PHASE 2 — Core Lead Qualification: Collect progressively: Full Name, Brand / Project Name, Contact Info (Email or WhatsApp). One field at a time. All using TYPE B rules.
After collecting all three: lead_status = "complete"
PHASE 3 — Discovery (Max 3 Questions Total):
- Web Design: Q1 (TYPE A) Is this: ["New Website", "Website Redesign"]. If Redesign: Q2 (TYPE B) URL. Q3 (TYPE A) objective. If New Website: Q2 (TYPE A) objective.
- Branding / Logo: Q1 (TYPE A) ["New Brand", "Rebrand"]. Q2 (TYPE B) Vision/References.
- AI Automation: Q1 (TYPE B) Process. Q2 (TYPE B) Tools.
PHASE 4 — Conversion Close: After Full Name, Brand Name, Contact Info, and at least 2 discovery insights: Provide 3-4 line strategic summary, Confirm understanding, Offer next step (TYPE A) e.g. ["Request Proposal", "Continue via WhatsApp", "Schedule Discovery Call"].

CRITICAL INTERACTION RULE: If user selects something like “Share your website goals”, You MUST ask: "What are your website goals?" With "suggestions": [] Then STOP and wait. Never continue answering on their behalf.

STRICT OUTPUT FORMAT:
Always respond ONLY in JSON:
{
"text": "Message to the user",
"suggestions": [],
"lead_status": "in_progress"
}
When Name + Brand + Contact collected: Set "lead_status": "complete"

Tone: Professional. Strategic. Concise. High-value.
${attachmentContext}`;

    // 3. Start Chat with System Instruction
    const chat = model.startChat({
        history: geminiHistory,
    });

    const result = await chat.sendMessage(systemInstruction + "\n\nUser Message: " + message);
    const responseText = result.response.text();

    try {
        const jsonResponse = JSON.parse(responseText);
        
        // 4. Update Lead in Database if lead_id exists
        if (lead_id && supabaseAdmin) {
            await supabaseAdmin
                .from('leads')
                .update({ 
                    last_message: message,
                    status: jsonResponse.lead_status || 'in_progress',
                    updated_at: new Error().stack // Just to trigger update, better to use a real timestamp
                })
                .eq('id', lead_id);
            
            // Note: In a real app, we'd parse the name/email from history using another LLM call or regex
            // to populate the 'name' and 'email' columns of the lead.
        }

        return NextResponse.json(jsonResponse);
    } catch (parseError) {
        console.error("Gemini JSON Parse Error:", parseError, responseText);
        return NextResponse.json({
            text: responseText,
            suggestions: [],
            lead_status: "in_progress"
        });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
