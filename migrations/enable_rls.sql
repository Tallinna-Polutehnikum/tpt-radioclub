-- TPT Radio Club — Row Level Security policies
-- Run this in the Supabase SQL editor (or via supabase db push).
-- "Admin" = any authenticated user (matches client-side gating in App.tsx).
-- Ensure Auth -> Sign-ups are disabled if relying on this model.

-- ===================== 1. Activities =====================
alter table public.activities enable row level security;

create policy "activities_read" on public.activities
  for select to anon, authenticated using (true);

create policy "activities_admin_insert" on public.activities
  for insert to authenticated with check (true);
create policy "activities_admin_update" on public.activities
  for update to authenticated using (true) with check (true);
create policy "activities_admin_delete" on public.activities
  for delete to authenticated using (true);

-- ===================== 2. Callsigns =====================
alter table public.callsigns enable row level security;

create policy "callsigns_read" on public.callsigns
  for select to anon, authenticated using (true);
create policy "callsigns_admin_insert" on public.callsigns
  for insert to authenticated with check (true);
create policy "callsigns_admin_update" on public.callsigns
  for update to authenticated using (true) with check (true);
create policy "callsigns_admin_delete" on public.callsigns
  for delete to authenticated using (true);

-- ===================== 3. Gallery folders =====================
alter table public.gallery_folders enable row level security;

create policy "folders_read" on public.gallery_folders
  for select to anon, authenticated using (true);
create policy "folders_admin_insert" on public.gallery_folders
  for insert to authenticated with check (true);
create policy "folders_admin_update" on public.gallery_folders
  for update to authenticated using (true) with check (true);
create policy "folders_admin_delete" on public.gallery_folders
  for delete to authenticated using (true);

-- ===================== 4. Gallery images =====================
alter table public.gallery_images enable row level security;

create policy "images_read" on public.gallery_images
  for select to anon, authenticated using (true);
create policy "images_admin_insert" on public.gallery_images
  for insert to authenticated with check (true);
create policy "images_admin_update" on public.gallery_images
  for update to authenticated using (true) with check (true);
create policy "images_admin_delete" on public.gallery_images
  for delete to authenticated using (true);

-- ===================== 5. QSL board (public form) =====================
alter table public.qsl_messages enable row level security;

create policy "qsl_read" on public.qsl_messages
  for select to anon, authenticated using (true);
create policy "qsl_public_insert" on public.qsl_messages
  for insert to anon, authenticated with check (true);
create policy "qsl_admin_delete" on public.qsl_messages
  for delete to authenticated using (true);

-- ===================== 6. VP2026 registrations (public form) =====================
alter table public.vp2026_registrations enable row level security;

create policy "vp2026_read" on public.vp2026_registrations
  for select to anon, authenticated using (true);
create policy "vp2026_public_insert" on public.vp2026_registrations
  for insert to anon, authenticated with check (true);

-- ===================== 7. Storage bucket: gallery =====================
-- Ensure storage.objects RLS is enabled (Storage -> Policies) for these to apply.
create policy "gallery_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'gallery');
create policy "gallery_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery');
create policy "gallery_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'gallery');
create policy "gallery_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery');
