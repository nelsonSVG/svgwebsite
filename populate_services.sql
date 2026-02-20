-- Script corregido para inicializar servicios en Supabase
-- Este script soluciona el error de ID nulo asegurando la generación automática de UUID

-- 1. Asegurar que la tabla tenga la configuración correcta de ID automático
ALTER TABLE public.services 
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Limpiar datos antiguos
TRUNCATE TABLE public.services RESTART IDENTITY CASCADE;

-- 3. Insertar los servicios (Supabase generará los IDs automáticamente gracias al DEFAULT)
INSERT INTO public.services (title, description, icon_name)
VALUES 
('Web Design', 'Immersive, high-performance websites that blend stunning aesthetics with seamless functionality to tell your brand story.', 'layout'),
('Branding', 'Strategic brand identities including logos, typography, and visual systems that differentiate you in the market.', 'pen-tool'),
('Mobile Apps', 'Native and cross-platform mobile applications designed for intuition, engagement, and lasting user retention.', 'smartphone'),
('User Flow', 'Mapping out logical, efficient pathways to ensure your users achieve their goals without friction or confusion.', 'git-merge'),
('UI/UX Design', 'Designing interfaces that delight and experiences that convert. We bridge the gap between human needs and business goals.', 'layers'),
('AI Automation', 'Integrating intelligent automation into your digital products to enhance efficiency and personalize user experiences.', 'cpu');

-- 4. Asegurar RLS y políticas
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.services;

CREATE POLICY "Enable read access for all users" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.services
    FOR ALL USING (auth.role() = 'authenticated');
