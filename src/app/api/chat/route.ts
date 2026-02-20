import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], lead_id } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { text: "AI assistant is not configured. Please email hi@svgvisual.com directly." },
        { status: 200 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Fetch Metadata (Attachments count)
    let attachmentContext = "";
    let attachments: any[] = [];
    if (lead_id) {
        const { data: attData } = await supabase
            .from('attachments')
            .select('*')
            .eq('lead_id', lead_id);
        
        if (attData && attData.length > 0) {
            attachments = attData;
            attachmentContext = `\n[System Info: User has uploaded ${attData.length} reference files: ${attData.map(a => a.file_name).join(', ')}]`;
        }
    }

    // 2. Live Chat Interaction with Llama 3.1 8B Instant
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are “SVG Project Consultant”, the strategic digital advisor for SVG Visual.
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
Always respond ONLY in:
{
"text": "Message to the user",
"suggestions": [],
"lead_status": "in_progress"
}
When Name + Brand + Contact collected: Set "lead_status": "complete"

Tone: Professional. Strategic. Concise. High-value.
${attachmentContext}`,
        },
        ...history,
        { role: 'user', content: message },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";
    let parsedResponse: any;
    
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      parsedResponse = {
        text: responseText,
        suggestions: [],
        lead_status: "in_progress"
      };
    }

    // 3. Premium Brief Generation with GPT-OSS-20B if Lead is Complete
    if (parsedResponse.lead_status === 'complete' && lead_id) {
      try {
        const fullHistoryForSummary = [
          ...history,
          { role: 'user', content: message },
          { role: 'assistant', content: responseText }
        ].map(m => `${m.role}: ${m.content || m.text}`).join('\n');

        const summaryCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a Senior Business Analyst for SVG Visual.
You receive a full conversation between SVG Project Consultant and a potential client.
Your role is to generate an executive-level project brief for internal use.

ANALYSIS RULES: Extract ONLY information explicitly stated. Do NOT fabricate missing data. If missing, write: Not provided. Be analytical and structured. No conversational tone. No assumptions.

OUTPUT FORMAT (MANDATORY): Use clean Markdown.
Include sections: Client Name, Brand / Project Name, Contact Information, Requested Service, Project Type, Primary Objective, Secondary Objectives, Project Scope Summary, Discovery Insights, Current Assets Provided, Timeline Indicators, Budget Indicators, Lead Completeness Level, Strategic Opportunities, Risk Factors, Lead Potential Score, Recommended Internal Action.

GOAL: Deliver a concise, decision-ready summary for SVG Visual to prioritize leads. Executive clarity only.`
            },
            { role: 'user', content: `Analyze this conversation:\n\n${fullHistoryForSummary}\n\nAttachments provided: ${attachments.length > 0 ? attachments.map(a => a.file_name).join(', ') : 'None'}` }
          ],
          model: 'openai/gpt-oss-20b',
          temperature: 0.1
        });

        const premiumBrief = summaryCompletion.choices[0]?.message?.content || "";

        // 4. Update Lead in Database
        await supabase
          .from('leads')
          .update({
            full_name: parsedResponse.text.match(/name is ([^,.]+)/i)?.[1] || null, // Best effort extraction
            summary_brief: premiumBrief,
            lead_status: 'qualified'
          })
          .eq('id', lead_id);

        // 5. Send Email
        if (premiumBrief) {
          await resend.emails.send({
            from: 'SVG Project Consultant <onboarding@resend.dev>',
            to: 'hi@svgvisual.com',
            subject: `🔥 NEW QUALIFIED LEAD: ${lead_id.substring(0,8)}`,
            html: `<div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: auto;">
                    <div style="background: #000; color: #fff; padding: 30px; border-radius: 12px 12px 0 0;">
                      <h1 style="margin: 0; font-size: 24px;">SVG Visual</h1>
                      <p style="margin: 10px 0 0 0; opacity: 0.7; font-size: 14px;">Premium Project Brief</p>
                    </div>
                    <div style="background: #ffffff; padding: 40px; border: 1px solid #eaeaea; border-radius: 0 0 12px 12px;">
                      ${premiumBrief.split('\n').map(line => {
                        if (line.startsWith('#')) return `<h3 style="margin-top: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">${line.replace(/#/g, '').trim()}</h3>`;
                        if (line.includes(':')) {
                            const [title, ...rest] = line.split(':');
                            return `<p style="margin: 12px 0;"><strong>${title.replace(/[*_]/g, '').trim()}:</strong> ${rest.join(':').trim()}</p>`;
                        }
                        return `<p style="margin: 8px 0;">${line.trim()}</p>`;
                      }).join('')}
                      
                      ${attachments.length > 0 ? `
                        <h3 style="margin-top: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">Attachments</h3>
                        <ul style="padding-left: 20px;">
                          ${attachments.map(a => `<li><a href="${a.storage_url}" target="_blank">${a.file_name}</a></li>`).join('')}
                        </ul>
                      ` : ''}
                    </div>
                    <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
                      Executive Summary for Lead ${lead_id}
                    </p>
                  </div>`
          });
        }
      } catch (summaryError) {
        console.error('Failed to generate premium brief or send email:', summaryError);
      }
    }

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { text: JSON.stringify({ text: "Connection interrupted. Please email hi@svgvisual.com directly.", suggestions: [], lead_status: "in_progress" }) },
      { status: 200 }
    );
  }
}
