import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { text, context = "" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `You are a professional translator for a high-end digital design agency called SVG Visual.
Translate the following English text to professional, elegant, and modern Spanish.
The tone should be sophisticated and boutique-style.
Context: ${context}

Respond ONLY with the translated text, no explanations, no quotes.`;

    const result = await model.generateContent([systemInstruction, text]);
    const translatedText = result.response.text();

    return NextResponse.json({ translation: translatedText.trim() });
  } catch (error: any) {
    console.error('Translation API Error:', error);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
}
