import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const REFRESH_THRESHOLD_DAYS = 15; // Refrescar si faltan 15 días o menos

export async function GET() {
  try {
    // 1. Obtener el token actual de Supabase
    const { data: config, error: fetchError } = await supabase
      .from('instagram_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !config) {
      console.error('Error fetching Instagram config:', fetchError);
      // Fallback al token del .env si no hay en DB
      return await fetchInstagramFeed(process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN || "");
    }

    let currentToken = config.access_token;
    const updatedAt = new Date(config.updated_at);
    const now = new Date();
    
    // Calcular días desde la última actualización (aproximado ya que los tokens duran 60 días)
    const diffDays = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

    // 2. ¿Necesita renovación? (Si han pasado más de 45 días)
    if (diffDays >= (60 - REFRESH_THRESHOLD_DAYS)) {
      console.log('Refrescando token de Instagram...');
      try {
        const refreshResponse = await fetch(
          `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
        );
        const refreshData = await refreshResponse.json();

        if (refreshData.access_token) {
          currentToken = refreshData.access_token;
          // Actualizar en DB
          await supabase
            .from('instagram_config')
            .update({ 
              access_token: currentToken, 
              updated_at: new Date().toISOString() 
            })
            .eq('id', config.id);
          console.log('Token de Instagram refrescado exitosamente.');
        }
      } catch (refreshErr) {
        console.error('Error refreshing Instagram token:', refreshErr);
      }
    }

    // 3. Obtener el feed con el token (sea el original o el refrescado)
    return await fetchInstagramFeed(currentToken);

  } catch (error) {
    console.error('API Instagram Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

async function fetchInstagramFeed(token: string) {
  if (!token) {
    return NextResponse.json({ data: [] });
  }

  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&limit=12&access_token=${token}`,
    { next: { revalidate: 3600 } } // Cache por 1 hora
  );
  
  const data = await response.json();
  return NextResponse.json(data);
}
