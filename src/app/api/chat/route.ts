import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { text: "AI assistant is not configured. Please email hi@svgvisual.com directly." },
        { status: 200 }
      );
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are 'Savage', the intake specialist for SVG Visual. 
        
        GOAL: Convert the user into a qualified lead by gathering: Name, Project Type, and Budget/Timeline.
        
        RULES:
        1. BE BRIEF. Maximum 2 sentences per response. No fluff.
        2. Tone: Professional, direct, efficient, but polite.
        3. Do not write long paragraphs. 
        4. Ask one qualifying question at a time.
        5. Once you have the user's details, tell them: "Perfect. I've compiled this summary and sent it directly to Nelson. He'll be in touch shortly."
        
        Example Interaction:
        User: I need a website.
        Savage: We can do that. What industry is this for, and do you have a deadline?
        User: It's a coffee shop, need it next month.
        Savage: Got it. And what is your estimated budget for this launch?`,
      }
    });

    const response = await chat.sendMessage({ message });
    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { text: "Connection interrupted. Please email hi@svgvisual.com directly." },
      { status: 200 }
    );
  }
}
