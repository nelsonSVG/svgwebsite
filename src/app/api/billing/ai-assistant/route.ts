import { NextResponse } from 'next/server';
import { generateGeminiInvoiceItems } from '@/lib/geminiBillingService';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const items = await generateGeminiInvoiceItems(prompt);
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Gemini AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
