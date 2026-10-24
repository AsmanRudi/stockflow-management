<div align="center">

# 📦 StockFlow

### *Modern, Real-Time Inventory Control & Stock Management System*

[![Node Version](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Vercel Ready](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  <b>Know your stock. Run smarter.</b><br>
  A high-performance JavaScript monorepo application engineered for seamless inventory tracking, supplier management, and atomic stock movement auditing.
</p>

[Explore Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-quick-start) • [API Reference](#-api-endpoints) • [Vercel Deployment](#-deployment-guide)

---

</div>

## 🌟 Highlights

* **⚡ Ultra-fast Single-Page App (SPA):** Built with **React 19** and bundled with **Vite 6** for blazing fast load times and instant UX feedback.
* **🛡️ Production-Grade Security:** Hardened with **HttpOnly lax session cookies**, JWT authentication, Helmet protection, strict CORS filtering, and Zod runtime schema validation.
* **🔒 Database-Level Atomicity:** Stock increments and decrements are bound inside atomic **Prisma transactions**, strictly prohibiting negative inventory drift or race conditions.
* **☁️ Cloud & Serverless Ready:** Seamlessly designed for **Vercel Serverless Functions** and **Neon PostgreSQL** with automated connection sanitization and pooler compatibility.

---

## 🚀 Features

### 📊 Real-Time Analytics & Dashboard
* **Dynamic Inventory Valuation:** Real-time computation of total inventory asset value ($\sum \text{price} \times \text{stock}$).
* **Stock Health Tracking:** Instant indicators for critical thresholds, out-of-stock items, and low-stock alerts.
* **Audit Trail Feed:** Live log of the most recent stock-in and stock-out events with actor attribution.

### 📦 Product & Catalog Management
* **Full Product Lifecycle:** Create, edit, search, and categorize inventory with unique SKU enforcement.
* **Safety Thresholds:** Configurable minimum stock quantities to proactively trigger replenishment warnings.
* **Deletion Safeguards:** Intelligent foreign key constraints prevent accidental deletion of products with existing transaction history.

### 🔄 Inbound & Outbound Movements
* **Directional Stock Recording:** Instant tracking of Stock-In (restock from suppliers) and Stock-Out (sales/distribution).
* **Audit Notes:** Annotate every movement with reference notes, supplier origins, or invoice details.
* **Negative Stock Prevention:** Automated checks verify inventory sufficiency before committing any outbound movement.

### 🚚 Vendor & Supplier Directory
* **Supplier Profiles:** Centralized registry for vendor contacts, phone numbers, email addresses, and facilities.
* **Product Association:** Seamlessly link products to their primary suppliers with automatic catalog counters.

---

## 🏗️ Architecture

StockFlow is structured as an npm workspaces monorepo:

```
stockflow-management/
├── api/                     # Vercel serverless entry point
│   └── index.js             # Serverless bridge to Express application
├── apps/
│   ├── api/                 # Express backend core
│   │   └── src/
│   │       ├── lib/         # Prisma client singleton & sanitizer
│   │       ├── middleware/  # JWT auth guard & secure cookie policies
│   │       ├── routes/      # REST API route handlers
│   │       ├── app.js       # Express app configuration & error interceptor
│   │       └── dev.js       # Local standalone API runner (Port 4000)
│   └── web/                 # React frontend application
│       ├── src/             # Components, state hooks, and API client
│       └── index.html       # Vite SPA root template
├── prisma/
│   ├── schema.prisma        # Database models & binary engine targets
│   ├── seed.js              # Initial admin provisioning script
│   └── migrations/          # Version-controlled SQL migration history
├── docs/                    # Architectural & API specifications
└── vercel.json              # Unified build rules & serverless routing
```

### 📐 Request Lifecycle Flow

```mermaid
flowchart LR
    Client["💻 Web Client\n(React 19 + Vite)"] -- "Fetch (/api/*)" --> Rewrites["🔀 Vercel Rewrites\n(vercel.json)"]
    Rewrites --> Entry["⚡ Serverless Entry\n(/api/index.js)"]
    Entry --> Express["🛡️ Express Core\n(Helmet, CORS, Cookies)"]
    Express --> Auth["🔐 Auth Middleware\n(JWT Verification)"]
    Auth --> Prisma["💎 Prisma ORM 6\n(Transaction Engine)"]
    Prisma --> Neon[("🐘 Neon PostgreSQL\n(AWS Cloud Pooler)")]
```

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [React 19](https://react.dev/) | Declarative UI with latest concurrent features |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Next-generation frontend tooling and HMR |
| **Icons & Design** | [Lucide React](https://lucide.dev/) | Clean, lightweight icon suite |
| **Backend** | [Express.js 4](https://expressjs.com/) | Robust REST API router in ES Module syntax |
| **Validation** | [Zod](https://zod.dev/) | TypeScript-first schema validation with static type inference |
| **Security** | [Helmet](https://helmetjs.github.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) | HTTP header hardening and secure password hashing |
| **ORM** | [Prisma 6](https://www.prisma.io/) | Next-generation Node.js ORM with auto-migrations |
| **Database** | [Neon PostgreSQL](https://neon.tech/) | Serverless Postgres with autoscaling connection pooler |
| **Hosting** | [Vercel](https://vercel.com/) | Unified static and serverless edge platform |

---

## ⚡ Quick Start

### 1. Prerequisites
* **Node.js:** `v20.0.0` or higher (compatible with Node 22 and 24)
* **npm:** `v9.0.0` or higher
* **PostgreSQL:** Local Postgres or a free cloud database on [Neon.tech](https://neon.tech)

### 2. Clone & Install
```bash
git clone https://github.com/your-username/stockflow-management.git
cd stockflow-management
npm install
```

### 3. Environment Setup
Copy the sample environment configuration to `.env`:
```bash
cp .env.example .env
```

Configure your `.env` variables:
```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/stockflow?sslmode=prefer"

# Server configuration
PORT=4000
FRONTEND_URL="http://localhost:5173"

# JWT Secret (minimum 32 characters)
JWT_SECRET="SUPER_SECRET_KEY_MINIMUM_32_CHARACTERS_LONG"

# Seed administrator credentials
ADMIN_NAME="StockFlow Admin"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="SecureAdminPassword123!"

# Local dev cookie policy (set to true in production)
COOKIE_SECURE="false"
```

### 4. Database Migration & Seeding
```bash
# Push Prisma schema to database
npx prisma db push

# Provision initial admin account
npm run db:seed
```

### 5. Run Local Development
Open two terminal windows:

```bash
# Terminal 1: Run Express API Server (Port 4000)
npm run dev:api

# Terminal 2: Run React Vite Dev Server (Port 5173)
npm run dev:web
```

Visit [`http://localhost:5173`](http://localhost:5173) in your browser and sign in using your admin credentials.

---

## 📡 API Endpoints

All endpoints are hosted under `/api` (`/api/*` is proxied in development and routed seamlessly on Vercel).

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status, live database health & environment diagnostics |
| `POST` | `/api/auth/login` | Public | Authenticates admin and sets `HttpOnly` session cookie |
| `POST` | `/api/auth/logout` | Protected | Clears authentication session cookie |
| `GET` | `/api/auth/me` | Protected | Returns current authenticated administrator profile |
| `GET` | `/api/dashboard` | Protected | Inventory aggregates, total valuation, and low-stock items |
| `GET` | `/api/products` | Protected | List all catalog products with supplier relations |
| `POST` | `/api/products` | Protected | Create new product (Unique SKU enforced) |
| `PUT` | `/api/products/:id` | Protected | Update product details, price, or minimum threshold |
| `DELETE`| `/api/products/:id` | Protected | Delete product (Blocked if transaction history exists) |
| `GET` | `/api/suppliers` | Protected | List registered suppliers and active product counts |
| `POST` | `/api/suppliers` | Protected | Register a new vendor profile |
| `PUT` | `/api/suppliers/:id`| Protected | Update supplier information |
| `DELETE`| `/api/suppliers/:id`| Protected | Delete supplier record |
| `GET` | `/api/transactions` | Protected | Retrieve all historical stock movement logs |
| `POST` | `/api/transactions` | Protected | Commit atomic stock transaction (`IN` or `OUT`) |

---

## 🚀 Deployment Guide (Vercel)

### 1. Push Code to GitHub
Ensure all changes are committed and pushed to your GitHub repository.

### 2. Import Project to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New** > **Project**.
2. Select your `stockflow-management` repository.
3. Leave **Root Directory** as `./` (Vercel automatically detects `vercel.json`).

### 3. Configure Environment Variables
In your Vercel Project Settings > **Environment Variables**, add the following (apply to **Production**, **Preview**, and **Development**):

| Key | Example Value | Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@host-pooler.neon.tech/neondb?sslmode=require` | Do **not** wrap in quotes |
| `JWT_SECRET` | `YOUR_RANDOM_LONG_SECRET_KEY_MIN_32_CHARS` | Minimum 32 characters |
| `NODE_ENV` | `production` | Enables production optimizations |
| `FRONTEND_URL` | `https://your-domain.vercel.app` | Production origin for CORS whitelist |

### 4. Deploy & Verify
* Click **Deploy**.
* After deployment completes, visit `https://your-domain.vercel.app/api/health` to confirm the database status reads `"status": "connected"`.
* Log in through the web portal using your seeded administrator credentials.

---

## 🔐 Security & Best Practices

* **Zero Plaintext Secrets:** Passwords are salted and hashed using Bcrypt with work factor 12.
* **XSS Defenses:** Session tokens are stored strictly within `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
* **Sanitized Inputs:** All incoming payloads are strictly verified against Zod schemas before hitting business logic.
* **URL Sanitization:** Automatic stripping of accidental quotation marks and prefixes from database connection strings at runtime.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for educational and commercial inventory management needs.

<div align="center">
  <sub>Engineered with precision for agile business operations.</sub>
</div>
