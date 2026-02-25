-- Esquema para facturación (ahora en public para evitar problemas de configuración de esquemas en Supabase)

-- Tabla de secuencias de numeración
CREATE TABLE IF NOT EXISTS public.invoice_sequences (
  series_name TEXT PRIMARY KEY,
  next_number INTEGER NOT NULL,
  prefix TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inicializar con continuación del sistema anterior (empezando en NC-006)
INSERT INTO public.invoice_sequences (series_name, next_number, prefix)
VALUES ('NC', 6, 'NC'), ('TEST', 1, 'TEST')
ON CONFLICT (series_name) DO UPDATE SET next_number = EXCLUDED.next_number, prefix = EXCLUDED.prefix;

-- Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  language_preference TEXT DEFAULT 'en', -- 'en' o 'es'
  payment_preference TEXT DEFAULT 'card', -- 'card' o 'transfer'
  company_name TEXT,
  tax_id TEXT, -- NIT/RUT/CUIT
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tipo de estado de factura
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
    CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'void', 'migrated');
  END IF;
END$$;

-- Facturas
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  status invoice_status DEFAULT 'draft',
  
  -- Montos
  subtotal NUMERIC NOT NULL,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Fechas
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Pagos
  payment_method_preference TEXT DEFAULT 'card',
  epayco_link TEXT,
  epayco_session_id TEXT,
  bank_transfer_info JSONB,
  
  -- Archivos
  pdf_url TEXT,
  pdf_storage_path TEXT,
  
  -- Control
  is_test BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT, -- 'monthly', 'quarterly', 'yearly'
  next_billing_date DATE,
  manually_marked_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Idioma
  language TEXT DEFAULT 'en',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items de factura
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eventos de tracking (analíticas)
CREATE TABLE IF NOT EXISTS public.invoice_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id),
  event_type TEXT NOT NULL, -- 'email_opened', 'viewed', 'paid_button_clicked', 'pdf_downloaded'
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}', -- IP, user_agent, country, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facturas migradas (sistema anterior, solo lectura)
CREATE TABLE IF NOT EXISTS public.migrated_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_name TEXT,
  client_email TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  issue_date DATE,
  status TEXT DEFAULT 'migrated',
  original_system TEXT,
  pdf_url TEXT,
  migrated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auditoría (quién hizo qué)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL, -- 'created', 'updated', 'voided', 'paid'
  invoice_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función RPC atómica para siguiente número de factura
CREATE OR REPLACE FUNCTION get_next_invoice_number(series_name TEXT)
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Habilitar RLS
ALTER TABLE public.invoice_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migrated_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (usando DROP POLICY IF EXISTS para evitar errores al re-ejecutar)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins have full access" ON public.invoice_sequences;
    CREATE POLICY "Admins have full access" ON public.invoice_sequences FOR ALL TO authenticated USING (auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Admins have full access" ON public.clients;
    CREATE POLICY "Admins have full access" ON public.clients FOR ALL TO authenticated USING (auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Admins have full access" ON public.invoices;
    CREATE POLICY "Admins have full access" ON public.invoices FOR ALL TO authenticated USING (auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Admins have full access" ON public.invoice_items;
    CREATE POLICY "Admins have full access" ON public.invoice_items FOR ALL TO authenticated USING (auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Admins have full access" ON public.invoice_events;
    CREATE POLICY "Admins have full access" ON public.invoice_events FOR ALL TO authenticated USING (auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Admins have full access" ON public.migrated_invoices;
    CREATE POLICY "Admins have full access" ON public.migrated_invoices FOR ALL TO authenticated USING (auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Admins have full access" ON public.audit_log;
    CREATE POLICY "Admins have full access" ON public.audit_log FOR ALL TO authenticated USING (auth.role() = 'authenticated');
END $$;

-- Política pública para ver facturas por número (requerido para clientes)
DROP POLICY IF EXISTS "Public can view invoice by number" ON public.invoices;
CREATE POLICY "Public can view invoice by number" ON public.invoices FOR SELECT TO anon, authenticated USING (true);

-- Política pública para ver items de factura (requerido para visualización pública)
DROP POLICY IF EXISTS "Public can view invoice items" ON public.invoice_items;
CREATE POLICY "Public can view invoice items" ON public.invoice_items FOR SELECT TO anon, authenticated USING (true);
