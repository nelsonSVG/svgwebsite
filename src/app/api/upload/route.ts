import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const leadId = formData.get('lead_id') as string;

    if (!file || !leadId) {
      return NextResponse.json({ error: 'File and lead_id are required' }, { status: 400 });
    }

    // 1. Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${leadId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-assets')
      .getPublicUrl(filePath);

    // 3. Save metadata to Database
    const { error: dbError } = await supabase
      .from('attachments')
      .insert([
        {
          lead_id: leadId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_url: publicUrl
        }
      ]);

    if (dbError) throw dbError;

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: publicUrl 
    });

  } catch (error: any) {
    console.error('Upload Error:', error.message);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
