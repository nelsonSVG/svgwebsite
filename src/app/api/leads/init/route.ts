import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(_request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ lead_status: 'in_progress' }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lead_id: data.id });
  } catch (error: any) {
    console.error('Lead Init Error:', error.message);
    return NextResponse.json({ error: 'Failed to initialize lead' }, { status: 500 });
  }
}
