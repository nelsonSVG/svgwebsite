-- Script para inicializar servicios con traducciones al español y ID automático

-- 1. Asegurar ID automático
ALTER TABLE public.services 
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Limpiar datos antiguos
TRUNCATE TABLE public.services RESTART IDENTITY CASCADE;

-- 3. Insertar servicios con traducciones
INSERT INTO public.services (title, title_es, description, description_es, icon_name)
VALUES 
(
    'Web Design', 
    'Diseño Web', 
    'Immersive, high-performance websites that blend stunning aesthetics with seamless functionality to tell your brand story.', 
    'Sitios web inmersivos y de alto rendimiento que fusionan una estética impresionante con una funcionalidad impecable para narrar la historia de su marca.', 
    'layout'
),
(
    'Branding', 
    'Branding', 
    'Strategic brand identities including logos, typography, and visual systems that differentiate you in the market.', 
    'Identidades de marca estratégicas que incluyen logotipos, tipografía y sistemas visuales que le diferencian en el mercado.', 
    'pen-tool'
),
(
    'Mobile Apps', 
    'Apps Móviles', 
    'Native and cross-platform mobile applications designed for intuition, engagement, and lasting user retention.', 
    'Aplicaciones móviles nativas y multiplataforma diseñadas para la intuición, el compromiso y la retención duradera de los usuarios.', 
    'smartphone'
),
(
    'User Flow', 
    'Flujo de Usuario', 
    'Mapping out logical, efficient pathways to ensure your users achieve their goals without friction or confusion.', 
    'Mapeo de rutas lógicas y eficientes para asegurar que sus usuarios alcancen sus objetivos sin fricciones ni confusiones.', 
    'git-merge'
),
(
    'UI/UX Design', 
    'Diseño UI/UX', 
    'Designing interfaces that delight and experiences that convert. We bridge the gap between human needs and business goals.', 
    'Diseño de interfaces que cautivan y experiencias que convierten. Cerramos la brecha entre las necesidades humanas y los objetivos de negocio.', 
    'layers'
),
(
    'AI Automation', 
    'Automatización IA', 
    'Integrating intelligent automation into your digital products to enhance efficiency and personalize user experiences.', 
    'Integración de automatización inteligente en sus productos digitales para mejorar la eficiencia y personalizar las experiencias de los usuarios.', 
    'cpu'
);

-- 4. Asegurar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.services;

CREATE POLICY "Enable read access for all users" ON public.services FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.services FOR ALL USING (auth.role() = 'authenticated');
