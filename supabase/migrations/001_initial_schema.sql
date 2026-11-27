create extension if not exists pgcrypto;
create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,email text,full_name text,role text not null default 'customer' check(role in ('customer','admin')),created_at timestamptz not null default now());
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,email,full_name) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict(id) do update set email=excluded.email; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.products(
 id uuid primary key default gen_random_uuid(),slug text not null unique,name text not null,description text not null default '',
 price_cents integer not null check(price_cents>0),compare_at_cents integer check(compare_at_cents is null or compare_at_cents>0),
 image_url text not null,category text not null,stock integer not null default 0 check(stock>=0),active boolean not null default true,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.orders(
 id uuid primary key default gen_random_uuid(),user_id uuid references public.profiles(id) on delete set null,email text not null,
 shipping jsonb not null,notes text not null default '',subtotal_cents integer not null check(subtotal_cents>=0),
 shipping_cents integer not null default 0 check(shipping_cents>=0),total_cents integer not null check(total_cents>=0),
 status text not null default 'created' check(status in ('created','pending','paid','canceled','expired','failed','payment_failed','processing','shipped','refunded')),
 mollie_payment_id text unique,created_at timestamptz not null default now()
);
create table if not exists public.order_items(
 id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null,product_name text not null,
 unit_price_cents integer not null,quantity integer not null check(quantity>0),line_total_cents integer not null
);
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
drop policy if exists "Profiles can view own profile" on public.profiles;
create policy "Profiles can view own profile" on public.profiles for select using(auth.uid()=id);
drop policy if exists "Profiles can update own name" on public.profiles;
create policy "Profiles can update own name" on public.profiles for update using(auth.uid()=id) with check(auth.uid()=id and role='customer');
drop policy if exists "Active products are public" on public.products;
create policy "Active products are public" on public.products for select using(active=true);
drop policy if exists "Customers view own orders" on public.orders;
create policy "Customers view own orders" on public.orders for select using(auth.uid()=user_id);
drop policy if exists "Customers view own order items" on public.order_items;
create policy "Customers view own order items" on public.order_items for select using(exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));

create or replace function public.create_safalina_order(p_user_id uuid,p_shipping jsonb,p_notes text,p_items jsonb)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_order_id uuid:=gen_random_uuid(); v_item jsonb; v_product public.products%rowtype; v_subtotal integer:=0; v_qty integer;
begin
 if auth.uid() is null or auth.uid()<>p_user_id then raise exception 'not_authorized'; end if;
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)<1 then raise exception 'empty_order'; end if;
 for v_item in select * from jsonb_array_elements(p_items) loop
  v_qty:=(v_item->>'quantity')::integer;
  if v_qty<1 or v_qty>10 then raise exception 'invalid_quantity'; end if;
  select * into v_product from public.products where id=(v_item->>'productId')::uuid and active=true for update;
  if not found or v_product.stock<v_qty then raise exception 'out_of_stock'; end if;
  v_subtotal:=v_subtotal+(v_product.price_cents*v_qty);
 end loop;
 insert into public.orders(id,user_id,email,shipping,notes,subtotal_cents,total_cents,status)
 values(v_order_id,p_user_id,p_shipping->>'email',p_shipping,p_notes,v_subtotal,v_subtotal,'created');
 for v_item in select * from jsonb_array_elements(p_items) loop
  v_qty:=(v_item->>'quantity')::integer;
  select * into v_product from public.products where id=(v_item->>'productId')::uuid for update;
  insert into public.order_items(order_id,product_id,product_name,unit_price_cents,quantity,line_total_cents)
  values(v_order_id,v_product.id,v_product.name,v_product.price_cents,v_qty,v_product.price_cents*v_qty);
  update public.products set stock=stock-v_qty,updated_at=now() where id=v_product.id;
 end loop;
 return v_order_id;
end; $$;
revoke all on function public.create_safalina_order(uuid,jsonb,text,jsonb) from public;
grant execute on function public.create_safalina_order(uuid,jsonb,text,jsonb) to authenticated;
-- After creating your account, promote the store owner in the SQL editor:
-- update public.profiles set role='admin' where email='YOUR_ADMIN_EMAIL';
