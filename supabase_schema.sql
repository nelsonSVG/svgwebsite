-- SQL SCHEMA FOR SVG VISUAL LEADS SYSTEM

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Leads Table
create table if not exists leads (
    id uuid primary key default uuid_generate_v4(),
    full_name text,
    brand_name text,
    email text,
    whatsapp text,
    service_type text,
    project_type text,
    objective text,
    discovery_data jsonb default '{}'::jsonb,
    summary_brief text,
    lead_status text default 'in_progress', -- in_progress / qualified / closed
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Attachments Table
create table if not exists attachments (
    id uuid primary key default uuid_generate_v4(),
    lead_id uuid references leads(id) on delete cascade,
    file_name text not null,
    file_type text,
    file_size bigint,
    storage_url text not null,
    uploaded_at timestamp with time zone default now()
);

-- Trigger to update updated_at on leads
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql
set search_path = public;

drop trigger if exists update_leads_updated_at on leads;
create trigger update_leads_updated_at
    before update on leads
    for each row
    execute function update_updated_at_column();

-- Instructions for Storage:
-- Create a public bucket named 'project-assets' in Supabase Storage.

-- Configuración de Instagram
create table if not exists public.instagram_config (
    id uuid primary key default uuid_generate_v4(),
    access_token text not null,
    updated_at timestamp with time zone default now(),
    expires_at timestamp with time zone
);

-- Security Improvements
alter table public.leads enable row level security;
alter table public.attachments enable row level security;
alter table public.instagram_config enable row level security;

-- Policies for Leads
drop policy if exists "Allow public insert on leads" on public.leads;
create policy "Allow public insert on leads" on public.leads for insert with check (true);

drop policy if exists "Allow admin full access on leads" on public.leads;
create policy "Allow admin full access on leads" on public.leads for all to authenticated using (auth.role() = 'authenticated');

-- Policies for Attachments
drop policy if exists "Allow public insert on attachments" on public.attachments;
create policy "Allow public insert on attachments" on public.attachments for insert with check (true);

drop policy if exists "Allow admin full access on attachments" on public.attachments;
create policy "Allow admin full access on attachments" on public.attachments for all to authenticated using (auth.role() = 'authenticated');

-- Policies for Instagram Config
drop policy if exists "Allow admin full access on instagram_config" on public.instagram_config;
create policy "Allow admin full access on instagram_config" on public.instagram_config for all to authenticated using (auth.role() = 'authenticated');

-- Insertar token inicial
-- Nota: En un entorno real, esto se manejaría desde el panel de administración o una migración controlada.
insert into public.instagram_config (access_token)
values ('IGAAKpX76bdCVBZAFppSzlrc2lCV3B0UGt6UlI5d3RDVHlzVmJEX1lvSFlQOTBsZAXRkMC1ZAT3VIbEZAqWHp5bFZA4SDg3ZAWVXNjBBUmFXTnp4SGZAtd09QSUpxSngxZAG9KajlaaHQ5R2FQTFgwZAXgyZAnZAkTHVjdkVHdENJdkNTdEl0awZDZD');
