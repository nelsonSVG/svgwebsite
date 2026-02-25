# Plan de Corrección de Seguridad - Supabase

Este documento detalla las acciones necesarias para corregir los errores de seguridad detectados por el linter de Supabase.

## Resumen de Cambios

1.  **Seguridad de Funciones:** Definir `search_path` en las funciones de base de datos para evitar ataques de búsqueda de esquemas.
2.  **Protección de Tablas Públicas:** Habilitar RLS en tablas críticas (`leads`, `attachments`, `instagram_config`).
3.  **Políticas RLS:** Endurecer las políticas de acceso para asegurar que solo usuarios autenticados (y opcionalmente administradores) tengan acceso.
4.  **Configuración de Auth:** Recomendaciones manuales para el Dashboard.

## Scripts de Corrección (SQL)

Debes ejecutar el siguiente código en el **SQL Editor** de tu Dashboard de Supabase.

### 1. Funciones Seguras

```sql
-- Actualizar función de timestamp con search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Actualizar generador de números de factura
CREATE OR REPLACE FUNCTION public.get_next_invoice_number(series_name TEXT)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  pfx TEXT;
BEGIN
  SELECT next_number, prefix INTO next_num, pfx
  FROM public.invoice_sequences
  WHERE series_name = $1
  FOR UPDATE;
  
  IF next_num IS NULL THEN
    RAISE EXCEPTION 'Series % not found', series_name;
  END IF;

  UPDATE public.invoice_sequences
  SET next_number = next_number + 1,
      updated_at = NOW()
  WHERE series_name = $1;
  
  RETURN pfx || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;
```

### 2. Tablas Públicas y RLS

```sql
-- Habilitar RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_config ENABLE ROW LEVEL SECURITY;

-- Políticas para Leads (Permitir envíos desde la web, lectura solo para admins)
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
CREATE POLICY "Allow public insert" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert" ON public.attachments;
CREATE POLICY "Allow public insert" ON public.attachments FOR INSERT WITH CHECK (true);

-- Acceso Admin (Usuario Autenticado)
CREATE POLICY "Allow admin access" ON public.leads FOR ALL TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin access" ON public.attachments FOR ALL TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin access" ON public.instagram_config FOR ALL TO authenticated USING (auth.role() = 'authenticated');
```

### 3. Endurecimiento de Facturación (Billing)

```sql
-- Cambiar USING (true) por verificación de autenticación
DO $$
DECLARE
    tablas TEXT[] := ARRAY[
        'invoice_sequences', 'clients', 'invoices', 'invoice_items', 
        'invoice_events', 'migrated_invoices', 'audit_log'
    ];
    tabla TEXT;
BEGIN
    FOREACH tabla IN ARRAY tablas
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admins have full access" ON public.%I', tabla);
        EXECUTE format('CREATE POLICY "Admins have full access" ON public.%I FOR ALL TO authenticated USING (auth.role() = ''authenticated'')', tabla);
    END LOOP;
END $$;
```

## Acciones Manuales (Dashboard)

1.  **Autenticación:**
    *   Ir a **Authentication** > **Providers** > **Email**.
    *   Activar la opción **"Enable leaked password protection"**.
2.  **Verificación de Roles:**
    *   Si tienes un sistema de roles específico (ej. `app_metadata -> 'role' = 'admin'`), se recomienda actualizar las políticas RLS arriba mencionadas para usar ese check específico en lugar de solo `authenticated`.
