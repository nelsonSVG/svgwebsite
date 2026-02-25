import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // Basic protection: Check for bot-like behavior or just create a placeholder
    // In a real scenario, you might want to wait for the first message, 
    // but the Assistant component expects a lead_id immediately.
    
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database admin client not configured' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([
        { 
          status: 'new',
          source: 'chatbot_init',
          metadata: {
            user_agent: request.headers.get('user-agent'),
            language: request.headers.get('accept-language')
          }
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      lead_id: data.id 
    });

  } catch (error) {
    console.error('Lead Init API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
