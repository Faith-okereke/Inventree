# Inventory & Order Management System — Build Plan

**Goal:** A backend for a small shop — track products, stock, orders, and give admins a dashboard. Built to reinforce raw SQL, Express CRUD, and push slightly into auth + transactions.

**Stack:** Node.js, Express, PostgreSQL (`pg`), JWT auth, bcrypt.

---

## Phase 0 — Project Setup (Day 1)

- [ ] `npm init`, install `express`, `pg`, `dotenv`, `bcrypt`, `jsonwebtoken`, `cors`
- [ ] Folder structure:
  ```
  /db          → db.js (pool connection), migrations/
  /services    → productService.js, orderService.js, userService.js
  /routes      → products.js, orders.js, auth.js, dashboard.js
  /middleware  → authMiddleware.js
  index.js
  .env         → DATABASE_URL, JWT_SECRET
  ```
- [ ] Create local Postgres database: `inventory_app`
- [ ] Confirm connection with a test query before building anything else

---

## Phase 1 — Schema & Raw SQL (Days 2–4)

- [ ] Write migration files in order:
  - `001_create_users_table.sql`
  - `002_create_products_table.sql`
  - `003_create_orders_table.sql`
  - `004_create_order_items_table.sql`
- [ ] Add constraints: `UNIQUE` on `email` and `sku`, `NOT NULL` where needed, `FOREIGN KEY` on `orders.user_id`, `order_items.order_id`, `order_items.product_id`
- [ ] Seed ~20–30 fake products, a few users, using `generate_series` or manual inserts
- [ ] Practice raw queries directly in pgAdmin before writing any JS:
  - Total stock value: `SELECT SUM(price * quantity_in_stock) FROM products;`
  - Products low on stock: `WHERE quantity_in_stock < 10`
  - Join order_items → products → orders to see full order details

**Checkpoint:** you can explain, out loud, why `order_items` exists as a separate table instead of just adding a `product_id` column to `orders`.

---

## Phase 2 — Auth (Days 5–7)

- [ ] `POST /auth/register` — hash password with `bcrypt.hash()`, store user, role defaults to `staff`
- [ ] `POST /auth/login` — verify password with `bcrypt.compare()`, sign a JWT with `jsonwebtoken`, return it
- [ ] `authMiddleware.js` — reads `Authorization: Bearer <token>` header, verifies JWT, attaches `req.user`
- [ ] `roleMiddleware.js` (optional but recommended) — checks `req.user.role === 'admin'` for protected admin routes
- [ ] Protect a test route to confirm middleware works before moving on

**Checkpoint:** hitting a protected route with no token returns 401; with a valid token, it works; with a staff token on an admin-only route, it returns 403.

---

## Phase 3 — Core CRUD (Days 8–12)

- [ ] Products: `GET /products`, `GET /products/:id`, `POST /products` (admin only), `PATCH /products/:id`, `DELETE /products/:id`
- [ ] Orders:
  - `POST /orders` — creates order + order_items **inside a transaction** (BEGIN/COMMIT/ROLLBACK)
  - `GET /orders/:id` — joins order + order_items + product names into one response
  - `GET /orders` — list all orders (filter by status optional)
  - `PATCH /orders/:id/status` — update order status (pending → fulfilled, etc.)
- [ ] Every route: proper status codes (200/201/400/404/500), parameterized queries, try/catch

**Checkpoint:** placing an order via Postman actually decreases the relevant product's `quantity_in_stock` (decide: do this in the same transaction, or as a separate step — either is fine, just be intentional).

---

## Phase 4 — Dashboard Endpoints (Days 13–16)

- [ ] `GET /dashboard/summary` (admin only) — total revenue, total orders, count of low-stock products
- [ ] `GET /dashboard/top-products` — `GROUP BY product_id`, `SUM(quantity)`, `ORDER BY`, `LIMIT 5`
- [ ] `GET /dashboard/low-stock` — products under a threshold
- [ ] Run `EXPLAIN ANALYZE` on these dashboard queries once you have enough seed data (bump to 1,000+ orders with `generate_series` if needed) — check if indexes on `order_items.product_id` or `orders.created_at` help

**Checkpoint:** you can point to one query here and explain, using EXPLAIN ANALYZE output, whether it's using an index and why.

---

## Phase 5 — User Section vs Admin Dashboard (Days 17–19)

- [ ] Staff-facing routes: browse products, place orders — role = `staff`, gated by `authMiddleware` only
- [ ] Admin-facing routes: dashboard stats, manage products, view all orders — gated by `authMiddleware` + `roleMiddleware('admin')`
- [ ] Optional: build a minimal frontend (even plain HTML/fetch, or a quick React app) with two views — a staff order form and an admin dashboard — just enough to demo the split

---

## Phase 6 — Polish (Days 20–21)

- [ ] Add input validation (name/email/price sanity checks) — consider `zod` or manual checks
- [ ] Review every route for consistent error responses
- [ ] Write a short `README.md`: what it does, how to run it, endpoint list
- [ ] Deploy (Render/Railway) with a hosted Postgres (Neon) so it's live and shareable

---

## Stretch Goals (only if core is fully working and you want more)

- Pagination on `GET /products` and `GET /orders`
- Soft deletes (`deleted_at` column) instead of hard `DELETE`
- Rate limiting on `/auth/login` (ties back to what you asked about early on)


## more routes to add to make system robust

User Management (/api/users): While you have authentication (/auth), you'll need endpoints for administrators to manage users (e.g., view list, edit roles, delete users) and for users to manage their own profiles.

GET /api/users - List all users (admin only).
GET /api/users/:id - Get a single user's details.
PUT /api/users/:id - Update a user's profile or roles.
Inventory Movements (/api/inventory): Your products route likely handles the product catalog, but a dedicated inventory route can manage the why behind stock changes. This creates a valuable audit trail.

POST /api/inventory/adjustments - Log manual stock changes (e.g., for damaged goods or stocktakes).
GET /api/inventory/history/:productId - View the entire stock movement history for a product.
Supplier Management (/api/suppliers): Products come from somewhere. This route would manage your vendors.

POST /api/suppliers - Add a new supplier.
GET /api/suppliers - List all suppliers.
GET /api/suppliers/:id - View details and associated products for a specific supplier.
Purchase Orders (/api/purchase-orders): This is the core of restocking. It connects your products and suppliers.

POST /api/purchase-orders - Create a new order to a supplier to replenish stock.
PUT /api/purchase-orders/:id/receive - Mark a purchase order as received, which would automatically update the quantityInStock for the relevant products.
Product Categories (/api/categories): Grouping products into categories is essential for organization, filtering, and reporting.

POST /api/categories - Create a new product category.
GET /api/categories - List all categories.