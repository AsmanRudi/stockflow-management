# API Overview

All routes are same-origin under `/api` in production. Local API runs on port 4000.

- `GET /api/health` — health check
- `POST /api/auth/login` — `{ "email": "...", "password": "..." }`
- `POST /api/auth/logout` — clear session cookie
- `GET /api/auth/me` — current admin
- `GET|POST /api/products` — list/create products
- `GET|PUT|DELETE /api/products/:id` — product operations
- `GET|POST /api/suppliers` — list/create suppliers
- `PUT|DELETE /api/suppliers/:id` — supplier operations
- `GET /api/transactions` — stock movement history
- `POST /api/transactions` — `{ productId, type: "IN"|"OUT", quantity, note? }`
- `GET /api/dashboard` — inventory metrics

All routes except health and login require a valid session cookie.
