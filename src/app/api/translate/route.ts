import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const { text, context = "" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Groq API Key not configured' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional translator for a high-end digital design agency called SVG Visual.
Translate the following English text to professional, elegant, and modern Spanish.
The tone should be sophisticated and boutique-style.
Context: ${context}

Respond ONLY with the translated text, no explanations, no quotes.`
        },
        { role: 'user', content: text },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
    });

    const translatedText = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ translation: translatedText.trim() });
  } catch (error: any) {
    console.error('Translation API Error:', error);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
}
