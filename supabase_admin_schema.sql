-- SQL SCHEMA FOR SVG VISUAL ADMIN SYSTEM
-- Run this in your Supabase SQL Editor

-- 1. Projects Table
create table if not exists projects (
    id text primary key, -- slug like 'techflow'
    title text not null,
    category text not null, -- web, branding, apps, uiux
    category_label text not null,
    description text,
    client text,
    year text,
    services text[], -- array of strings
    images text[], -- array of URLs
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 2. Testimonials Table
create table if not exists testimonials (
    id uuid primary key default uuid_generate_v4(),
    quote text not null,
    author text not null,
    role text,
    initials text,
    created_at timestamp with time zone default now()
);

-- 3. Services Table (Dynamic services)
create table if not exists services (
    id text primary key,
    title text not null,
    description text,
    icon_name text, -- lucide icon name
    created_at timestamp with time zone default now()
);

-- 4. Storage Bucket for Project Images
-- Note: You must also create this bucket in the Supabase Dashboard -> Storage -> New Bucket: 'project-assets' (Public)

-- 5. Enable RLS (Row Level Security)
alter table projects enable row level security;
alter table testimonials enable row level security;
alter table services enable row level security;

-- 6. RLS Policies

-- Public Read Access
create policy "Allow public read access on projects" on projects for select using (true);
create policy "Allow public read access on testimonials" on testimonials for select using (true);
create policy "Allow public read access on services" on services for select using (true);

-- Admin Write Access (Only authenticated users)
-- In a real scenario, you'd check for a specific admin role or email.
-- For now, any authenticated user can manage (you'll be the only one with login credentials initially).
create policy "Allow admin full access on projects" on projects for all using (auth.role() = 'authenticated');
create policy "Allow admin full access on testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "Allow admin full access on services" on services for all using (auth.role() = 'authenticated');

-- 7. Initial Data Migration (Optional - from constants.tsx)
-- You can manually insert your current projects here or via the admin panel later.
