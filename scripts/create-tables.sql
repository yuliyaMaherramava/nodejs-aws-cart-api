create extension if not exists "uuid-ossp";

drop table if exists cart_items CASCADE;
drop table if exists orders CASCADE;
drop table if exists carts CASCADE;
drop table if exists users CASCADE;
drop type if exists cart_status CASCADE;
drop type if exists order_status CASCADE;

create type cart_status as enum ('OPEN', 'ORDERED');
create type order_status as enum ('OPEN', 'INPROGRESS','APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

create table users (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	email text,
	password text not null
);

create table carts (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid not null references users(id) on delete CASCADE,
	created_at timestamp not null default now(),
  	updated_at timestamp not null default now(),
	status cart_status
);

create table cart_items (
	cart_id uuid not null references carts(id) on delete CASCADE,
	product_id uuid not null,
	count integer not null
);

create table orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id) on delete no action,
    cart_id uuid not null references carts(id) on delete no action,
    payment json,
    delivery json,
    comments text,
    status order_status,
    total integer not null
);