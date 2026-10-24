# StockFlow — Inventory Management System

StockFlow is a JavaScript monorepo with React + Vite, Express, Prisma and PostgreSQL.

## Requirements
- Node.js 20+ (Node 24 is fine)
- npm
- PostgreSQL database (cloud database recommended for Vercel)

## Setup
1. Copy `.env.example` to `.env` at the repository root.
2. Fill in `DATABASE_URL`, `JWT_SECRET`, and a strong `ADMIN_PASSWORD`.
3. Install packages: `npm install`
4. Generate Prisma Client: `npm run db:generate`
5. Create the initial database migration: `npx prisma migrate dev --name init`
6. Create/update admin: `npm run db:seed`
7. Start API in one terminal: `npm run dev:api`
8. Start web in another terminal: `npm run dev:web`
9. Open `http://localhost:5173`.

## Local development note
The Vite development server proxies `/api` requests to `http://localhost:4000`. The browser uses relative `/api` URLs, so production requests are same-origin.

## Production / Vercel
1. Push this repository to GitHub.
2. Create a Vercel project connected to the repository root.
3. Set the required environment variables in Vercel: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `COOKIE_SECURE=true`, `FRONTEND_URL` equal to the production origin.
4. Deploy. The root `vercel.json` builds the Vite app into `apps/web/dist` and routes `/api/*` to `api/index.js`.
5. Apply migrations to the production database from a trusted local terminal with the production `DATABASE_URL`: `npm run db:deploy`. Do not run `migrate dev` against production.
6. Create the production admin using `npm run db:seed` with the production environment. Do not commit secrets.
7. Verify `/api/health`, login, product CRUD, and stock movements on the deployed domain.

## Security checklist before real production use
- Use a strong unique `JWT_SECRET` and admin password.
- Keep `.env` out of Git.
- Use HTTPS and `COOKIE_SECURE=true` in production.
- Restrict database credentials and use a least-privilege DB role where possible.
- Add rate limiting, audit logging, backups and monitoring before exposing to a large public audience.

## Scripts
- `npm run dev:web`
- `npm run dev:api`
- `npm run build`
- `npm run db:generate`
- `npm run db:migrate -- --name change_name` (for development migration; alternatively run Prisma CLI directly)
- `npm run db:deploy`
- `npm run db:seed`
- `npm test`
