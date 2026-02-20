import { NextResponse } from 'next/server';
import { generateGroqInvoiceItems } from '@/lib/groqBillingService';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await generateGroqInvoiceItems(prompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Gemini AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
