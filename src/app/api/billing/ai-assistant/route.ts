import { NextResponse } from 'next/server';
import { generateDeepSeekResponse } from '@/lib/deepseekService';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const items = await generateDeepSeekResponse(prompt);
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('DeepSeek AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
