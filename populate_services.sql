-- Script para inicializar servicios y configurar RLS

-- 1. Asegurar que la tabla existe (por si acaso)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Limpiar datos antiguos (opcional, para evitar duplicados en este paso)
DELETE FROM public.services;

-- 3. Insertar los servicios originales
INSERT INTO public.services (title, description, icon_name)
VALUES 
('Web Design', 'Immersive, high-performance websites that blend stunning aesthetics with seamless functionality to tell your brand story.', 'layout'),
('Branding', 'Strategic brand identities including logos, typography, and visual systems that differentiate you in the market.', 'pen-tool'),
('Mobile Apps', 'Native and cross-platform mobile applications designed for intuition, engagement, and lasting user retention.', 'smartphone'),
('User Flow', 'Mapping out logical, efficient pathways to ensure your users achieve their goals without friction or confusion.', 'git-merge'),
('UI/UX Design', 'Designing interfaces that delight and experiences that convert. We bridge the gap between human needs and business goals.', 'layers'),
('AI Automation', 'Integrating intelligent automation into your digital products to enhance efficiency and personalize user experiences.', 'cpu');

-- 4. Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas de RLS
-- Permitir lectura pública
CREATE POLICY "Allow public read access" ON public.services
    FOR SELECT USING (true);

-- Permitir gestión total a usuarios autenticados (admin)
CREATE POLICY "Allow authenticated full access" ON public.services
    FOR ALL USING (auth.role() = 'authenticated');
