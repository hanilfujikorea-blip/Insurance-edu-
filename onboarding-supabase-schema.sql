create table if not exists public.onboarding_employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  department text not null default '',
  team text default '',
  position text not null default '',
  start_date date not null,
  email text,
  phone text,
  salary bigint default 0,
  hire_type text default '신입',
  probation text default '해당없음',
  labor_contract jsonb not null default '{"signed": false, "signedAt": null, "signatureDataUrl": null, "text": ""}'::jsonb,
  salary_contract jsonb not null default '{"signed": false, "signedAt": null, "signatureDataUrl": null, "text": ""}'::jsonb,
  vehicle_number text default '',
  vehicle_model text default '',
  parking_approved text default 'none',
  completed_missions jsonb not null default '[]'::jsonb,
  sent_at text,
  status text default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_onboarding_employees_updated_at on public.onboarding_employees;
create trigger set_onboarding_employees_updated_at
before update on public.onboarding_employees
for each row
execute function public.set_updated_at();

alter table public.onboarding_employees enable row level security;

drop policy if exists "Allow public read onboarding employees" on public.onboarding_employees;
create policy "Allow public read onboarding employees" on public.onboarding_employees for select to anon using (true);

drop policy if exists "Allow public insert onboarding employees" on public.onboarding_employees;
create policy "Allow public insert onboarding employees" on public.onboarding_employees for insert to anon with check (true);

drop policy if exists "Allow public update onboarding employees" on public.onboarding_employees;
create policy "Allow public update onboarding employees" on public.onboarding_employees for update to anon using (true) with check (true);

drop policy if exists "Allow public delete onboarding employees" on public.onboarding_employees;
create policy "Allow public delete onboarding employees" on public.onboarding_employees for delete to anon using (true);

grant select, insert, update, delete on public.onboarding_employees to anon;
