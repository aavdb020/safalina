# Safalina

Custom-built Dutch ecommerce storefront. No Shopify dependency.

## Included
- Responsive storefront using a database-backed product catalogue
- Product listing and product detail pages
- Persistent browser cart and checkout form
- Supabase Auth customer registration/login and order history
- Supabase Postgres schema with RLS and atomic stock reservation
- Mollie payment creation and server-side payment verification webhook
- Protected admin area with product create/edit/hide and order overview
- GitHub Actions build/typecheck workflow

## Required setup before the app can run as a real shop
1. Create a Supabase project.
2. Copy .env.example to .env.local and add Supabase URL, anon key, service role key, Mollie test API key and site URL. Never expose the service role or Mollie key to the browser.
3. Run supabase/migrations/001_initial_schema.sql in the Supabase SQL editor. It creates tables, RLS policies, stock/order function and four clearly marked demo products.
4. Sign up at /login, confirm the email if required, then promote the owner account using Supabase SQL:
   update public.profiles set role='admin' where email='YOUR_ADMIN_EMAIL';
5. Sign in at /admin/login and replace demo product names, photos, prices, descriptions and stock with the real catalogue.
6. Start with a Mollie test key. Test paid, failed, canceled and expired payments before production.

## Local development
Run npm install and npm run dev. Open http://localhost:3000.

## Routes
- / home
- /shop catalogue
- /product/[slug] product detail
- /login customer login/registration
- /account protected customer account and orders
- /checkout checkout (requires sign-in)
- /checkout/bedankt payment return page
- /admin/login admin login
- /admin protected management dashboard

## Still needs owner-specific setup
- Real products and original product photos (seeded demo entries are placeholders).
- Final shipping price, shipping zones, delivery carrier and delivery promises. Default shipping is €4.95 via SHIPPING_FEE_CENTS.
- Production Supabase and Mollie credentials, verified webhook URL and deployment environment.
- Email confirmations/receipts, refund handling, fulfilment status workflow and privacy/cookie consent.
- Final legal review and correct company details on privacy/terms pages.

The site must not accept real orders until the database migration, production secrets, shipping rules, legal pages and payment tests are complete. Hosting free tiers have limits and do not guarantee uninterrupted uptime.
