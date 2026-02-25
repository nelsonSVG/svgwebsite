-- 1. FIX: Admins have full access (Billing Tables)
-- Instead of allowing ANY authenticated user, we restrict it to a specific email or UID.
-- Replace 'admin@yourdomain.com' with your actual admin email.

DO $$
BEGIN
    -- invoices
    DROP POLICY IF EXISTS "Admins have full access" ON public.invoices;
    CREATE POLICY "Admins have full access" ON public.invoices 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'nelson@svgvisual.com'); -- Replace with your email

    -- clients
    DROP POLICY IF EXISTS "Admins have full access" ON public.clients;
    CREATE POLICY "Admins have full access" ON public.clients 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'nelson@svgvisual.com');

    -- invoice_items
    DROP POLICY IF EXISTS "Admins have full access" ON public.invoice_items;
    CREATE POLICY "Admins have full access" ON public.invoice_items 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'nelson@svgvisual.com');

    -- audit_log
    DROP POLICY IF EXISTS "Admins have full access" ON public.audit_log;
    CREATE POLICY "Admins have full access" ON public.audit_log 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'nelson@svgvisual.com');

    -- invoice_sequences
    DROP POLICY IF EXISTS "Admins have full access" ON public.invoice_sequences;
    CREATE POLICY "Admins have full access" ON public.invoice_sequences 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'nelson@svgvisual.com');

    -- invoice_events
    DROP POLICY IF EXISTS "Admins have full access" ON public.invoice_events;
    CREATE POLICY "Admins have full access" ON public.invoice_events 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'nelson@svgvisual.com');

    -- migrated_invoices
    DROP POLICY IF EXISTS "Admins have full access" ON public.migrated_invoices;
    CREATE POLICY "Admins have full access" ON public.migrated_invoices 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'nelson@svgvisual.com');
END $$;

-- 2. FIX: Public Insert (Leads & Attachments)
-- We remove public access. Insertion will now ONLY be possible via API Route (service_role).

DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert on attachments" ON public.attachments;

-- Optional: Allow users to view their own leads if they have a session, 
-- but since leads are usually anonymous, we keep it tight.
