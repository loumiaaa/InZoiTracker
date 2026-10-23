-- Zoi Tracker : à exécuter une fois dans Supabase → SQL Editor.

-- Données de la joueuse : un document JSON par compte.
create table if not exists public.etats (
  user_id uuid primary key references auth.users on delete cascade,
  contenu jsonb not null,
  maj timestamptz not null default now()
);

alter table public.etats enable row level security;

create policy "Lire ses données" on public.etats for select to authenticated using (auth.uid() = user_id);
create policy "Créer ses données" on public.etats for insert to authenticated with check (auth.uid() = user_id);
create policy "Modifier ses données" on public.etats for update to authenticated using (auth.uid() = user_id);

-- Photos (portraits, bannières…) : chaque compte écrit uniquement dans son dossier.
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do nothing;

create policy "Envoyer ses photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Supprimer ses photos" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
