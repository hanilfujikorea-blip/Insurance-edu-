create table if not exists public.youth_grant_people (
  id uuid primary key,
  company text not null,
  department text not null default '',
  team text not null default '',
  position text not null default '',
  name text not null,
  hire_date date not null,
  resignation_date date,
  application_period text not null default '',
  insurance_applied boolean not null default false,
  milestones jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.insurances (
  id uuid primary key,
  contractor text not null,
  insurer text not null,
  car_number text not null,
  car_name text not null,
  year integer not null,
  start_date date not null,
  end_date date not null,
  premium integer not null default 0,
  payment_status text not null, -- 'O' or 'X'
  memo text,
  category text, -- '자동차'
  insurance_details text, -- '차량 보험'
  insured text, -- Likely same as contractor
  owner_id text, -- 'team_user'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trainings (
  id uuid primary key,
  affiliation text not null,
  name text not null,
  department text not null,
  team text,
  course text not null,
  vendor text not null,
  date_str text not null,
  date_iso date not null,
  fee integer not null default 0,
  refund integer not null default 0,
  net_fee integer not null default 0,
  payment_date date,
  refund_date date,
  report_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_youth_grant_people_updated_at on public.youth_grant_people;
create trigger set_youth_grant_people_updated_at
before update on public.youth_grant_people
for each row
execute function public.set_updated_at();

alter table public.youth_grant_people enable row level security;

drop policy if exists "Allow public read youth grant people" on public.youth_grant_people;
create policy "Allow public read youth grant people"
on public.youth_grant_people
for select
to anon
using (true);

drop policy if exists "Allow public insert youth grant people" on public.youth_grant_people;
create policy "Allow public insert youth grant people"
on public.youth_grant_people
for insert
to anon
with check (true);

drop policy if exists "Allow public update youth grant people" on public.youth_grant_people;
create policy "Allow public update youth grant people"
on public.youth_grant_people
for update
to anon
using (true)
with check (true);

drop policy if exists "Allow public delete youth grant people" on public.youth_grant_people;
create policy "Allow public delete youth grant people"
on public.youth_grant_people
for delete
to anon
using (true);

grant select, insert, update, delete on public.youth_grant_people to anon;

-- RLS policies and trigger for insurances table
drop trigger if exists set_insurances_updated_at on public.insurances;
create trigger set_insurances_updated_at
before update on public.insurances
for each row
execute function public.set_updated_at();

alter table public.insurances enable row level security;

create policy "Allow public read insurances"
on public.insurances
for select
to anon
using (true);

create policy "Allow public insert insurances"
on public.insurances
for insert
to anon
with check (true);

create policy "Allow public update insurances"
on public.insurances
for update
to anon
using (true)
with check (true);

create policy "Allow public delete insurances"
on public.insurances
for delete
to anon
using (true);

grant select, insert, update, delete on public.insurances to anon;

-- RLS policies and trigger for trainings table
drop trigger if exists set_trainings_updated_at on public.trainings;
create trigger set_trainings_updated_at
before update on public.trainings
for each row
execute function public.set_updated_at();

alter table public.trainings enable row level security;

create policy "Allow public read trainings"
on public.trainings
for select
to anon
using (true);

create policy "Allow public insert trainings"
on public.trainings
for insert
to anon
with check (true);

create policy "Allow public update trainings"
on public.trainings
for update
to anon
using (true)
with check (true);

create policy "Allow public delete trainings"
on public.trainings
for delete
to anon
using (true);

grant select, insert, update, delete on public.trainings to anon;

-- Onboarding Employees Table (Cloud Migration)
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
  hire_type text default '신입', -- '신입' | '경력'
  probation text default '해당없음', -- '100%' | '80%' | '해당없음'
  labor_contract jsonb not null default '{"signed": false, "signedAt": null, "signatureDataUrl": null, "text": ""}'::jsonb,
  salary_contract jsonb not null default '{"signed": false, "signedAt": null, "signatureDataUrl": null, "text": ""}'::jsonb,
  vehicle_number text default '',
  vehicle_model text default '',
  parking_approved text default 'none', -- 'none' | 'pending' | 'approved'
  completed_missions jsonb not null default '[]'::jsonb,
  sent_at text,
  status text default 'draft', -- 'draft' | 'sent' | 'completed'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS policies and trigger for onboarding_employees table
drop trigger if exists set_onboarding_employees_updated_at on public.onboarding_employees;
create trigger set_onboarding_employees_updated_at
before update on public.onboarding_employees
for each row
execute function public.set_updated_at();

alter table public.onboarding_employees enable row level security;

drop policy if exists "Allow public read onboarding employees" on public.onboarding_employees;
create policy "Allow public read onboarding employees"
on public.onboarding_employees
for select
to anon
using (true);

drop policy if exists "Allow public insert onboarding employees" on public.onboarding_employees;
create policy "Allow public insert onboarding employees"
on public.onboarding_employees
for insert
to anon
with check (true);

drop policy if exists "Allow public update onboarding employees" on public.onboarding_employees;
create policy "Allow public update onboarding employees"
on public.onboarding_employees
for update
to anon
using (true)
with check (true);

drop policy if exists "Allow public delete onboarding employees" on public.onboarding_employees;
create policy "Allow public delete onboarding employees"
on public.onboarding_employees
for delete
to anon
using (true);

grant select, insert, update, delete on public.onboarding_employees to anon;