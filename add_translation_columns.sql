-- Script para añadir columnas de traducción a las tablas existentes

-- 1. Añadir columnas a la tabla 'services'
ALTER TABLE public.services 
    ADD COLUMN IF NOT EXISTS title_es TEXT,
    ADD COLUMN IF NOT EXISTS description_es TEXT;

-- 2. Añadir columnas a la tabla 'projects'
ALTER TABLE public.projects 
    ADD COLUMN IF NOT EXISTS title_es TEXT,
    ADD COLUMN IF NOT EXISTS description_es TEXT,
    ADD COLUMN IF NOT EXISTS category_label_es TEXT;

-- 3. Notificar que las columnas han sido añadidas
COMMENT ON COLUMN public.services.title_es IS 'Traducción al español del título del servicio';
COMMENT ON COLUMN public.projects.title_es IS 'Traducción al español del título del proyecto';
