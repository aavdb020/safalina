# Safalina

Custom-built Dutch ecommerce storefront. No Shopify dependency.

## Current foundation
- Next.js App Router + TypeScript
- Warm luxury visual identity: cream, sand, mocha and terracotta
- Responsive storefront with product cards and collection sections
- Client-side demo cart, quantity controls, search and newsletter UI
- Initial admin dashboard shell at `/admin`

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Important
The catalogue currently contains demonstration products and image references. The cart is client-side only. No real orders or payments are processed, and the admin page is not yet protected by authentication.

## Before launch
1. Provision Supabase and implement server-side database access.
2. Add secure admin authentication and role checks.
3. Build product, inventory, customer and order management.
4. Connect Mollie with server-only credentials and verified webhooks.
5. Add shipping, tax, privacy, returns and transactional email workflows.
6. Test checkout end-to-end and deploy.

Never commit API keys or secrets. Use environment variables. Free hosting/database plans have limits and do not guarantee uninterrupted uptime.
