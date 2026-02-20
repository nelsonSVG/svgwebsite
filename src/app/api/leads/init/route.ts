import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  // Chatbot no longer creates lead on open to avoid empty leads
  return NextResponse.json({ success: true, message: "Lead creation deferred until user input" });
}
