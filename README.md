# Inventree

Inventree is a full-stack inventory management platform for small and
medium-sized businesses. It gives staff and administrators a central place to
manage products, monitor stock, process orders, manage users, and receive
supplier notifications when inventory reaches a configured low-stock level.

The application is split into a Next.js frontend and a TypeScript/Express
backend. The backend exposes a REST API backed by PostgreSQL through Prisma,
while the frontend provides the authenticated dashboard used to operate the
inventory system.

## Live application

- Frontend: https://inventree-crud.vercel.app

## Core capabilities

### Authentication and access control

- User registration and password login
- JWT-based authentication
- Google OAuth sign-in
- Password reset flow using emailed verification links
- Authenticated profile retrieval
- Role-aware access for administrative and staff workflows
- Persistent client sessions with logout and token cleanup

### Product and inventory management

- Create, view, update, and delete products
- Product names, descriptions, SKUs, prices, images, and stock quantities
- Supplier email addresses associated with products
- Configurable low-stock thresholds
- Product search, pagination, filtering, and detailed views
- Low-stock inventory visibility in the dashboard

### Automated low-stock alerts

When a product's stock changes from above its configured threshold to at or
below that threshold, the backend sends an email to the product's supplier.
Alerts are deliberately transition-based rather than repeatedly sending an
email every time the product is read or updated.

- Alerts require a supplier email address.
- Duplicate alerts are suppressed while the product remains below its
  threshold.
- Raising stock above the threshold resets the alert state.
- A later threshold crossing can then send a new alert.
- Stock changes caused directly by product updates and indirectly by orders
  use the same alert behavior.

Email delivery is implemented with Nodemailer and SMTP configuration.

### Order management

- Create customer orders from available inventory
- Track order items and the price recorded at the time of ordering
- Automatically decrement product stock when an order is created
- Cycle order statuses through pending, fulfilled, and cancelled states
- View order details, quantities, totals, and the staff member who created the
  order
- Refresh order data after status or inventory changes

### Dashboard and reporting

The dashboard provides an operational overview of the inventory system,
including:

- Total orders
- Total revenue
- Order counts grouped by status
- Top-selling products
- Products currently at or below their low-stock thresholds

### User administration

Administrators can view and manage users, search and filter the user list, and
review account roles and status information.

### API documentation and reliability

- Interactive Swagger documentation
- Health-check endpoint for deployment monitoring
- Request validation with Zod and Express validation middleware
- Centralized backend error handling
- Rate limiting middleware
- CORS configuration for local and deployed frontend clients
- Centralized frontend Axios error handling with HTTP status codes and API
  messages

## Architecture

```text
Next.js frontend
  |
  | Axios REST requests with JWT authorization
  v
Express and TypeScript API
  |
  | Prisma Client
  v
PostgreSQL database
  |
  +-- SMTP email delivery for password reset and low-stock alerts
```

### Frontend

The frontend is a Next.js application using the App Router. It uses:

- React and TypeScript
- TanStack Query for server-state fetching and mutations
- Redux Toolkit for in-memory application state
- Axios for API communication
- React Hot Toast for user feedback
- Tailwind CSS for styling
- Zod and typed request models for client-side validation

The frontend stores the canonical authenticated session in
`inventree:auth`. Non-authentication UI state, filters, and access preferences
are persisted separately under `inventree:state:v1`.

### Backend

The backend is an Express REST API written in TypeScript. Its main layers are:

- Routes for HTTP endpoint definitions
- Controllers for request and response handling
- Services for application and business logic
- Middleware for authentication, validation, rate limiting, and errors
- Prisma for database access
- Email services and templates for transactional notifications
- Swagger configuration and OpenAPI documentation

### Database model

The PostgreSQL database contains the following main entities:

- `User`: accounts, roles, authentication provider metadata, and profile data
- `PasswordResetToken`: short-lived password reset tokens
- `Product`: inventory records, prices, suppliers, and low-stock state
- `Order`: customer orders and order status
- `OrderItem`: products and quantities belonging to an order

## Repository structure

```text
Inventree/
├── backend/
│   ├── controllers/       HTTP request handlers
│   ├── docs/              OpenAPI documentation
│   ├── emails/            Email templates and notification logic
│   ├── middleware/        Authentication, validation, errors, and rate limits
│   ├── prisma/            Prisma schema and database configuration
│   ├── routes/            API route definitions
│   ├── services/          Business logic and database operations
│   ├── types/             Backend request and domain types
│   └── index.ts           Express application entry point
├── frontend/
│   ├── api-services/      Axios services and TanStack Query hooks
│   ├── app/               Next.js routes and layouts
│   ├── components/        Reusable dashboard and form components
│   ├── lib/               Shared client utilities and session handling
│   ├── store/             Redux store and persisted UI state
│   └── types/             Frontend domain and auth types
└── README.md
```

## Technology stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit
- TanStack Query
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JSON Web Tokens
- Nodemailer
- Swagger UI and OpenAPI
- Express Rate Limit

### Deployment

- Frontend deployment: Vercel
- Backend deployment: Render
- Database: PostgreSQL
- Email transport: SMTP

## Prerequisites

Install the following before running the project locally:

- Node.js 18 or later
- pnpm 10 or later
- A PostgreSQL database
- SMTP credentials for email features
- Google OAuth credentials if Google sign-in is enabled

## Local setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Inventree
```

### 2. Install backend dependencies

```bash
cd backend
pnpm install
```

Create `backend/.env` and configure the database, server, authentication,
Google OAuth, and SMTP values. Do not commit this file or any credentials.

Typical variables include:

```ini
SERVER_PORT=3000
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3001
SERVER_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-app-password
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Start the backend in development mode:

```bash
pnpm dev
```

The local API is available at `http://localhost:3000/api`.

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
pnpm install
```

Create `frontend/.env.local`:

```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

Start the frontend:

```bash
pnpm dev
```

The local dashboard is available at `http://localhost:3000` unless another
port is selected by Next.js.

## Useful commands

### Backend

```bash
pnpm dev
pnpm build
pnpm start
pnpm prisma generate
pnpm prisma studio
```

### Frontend

```bash
pnpm dev
pnpm build
pnpm start
pnpm typecheck
pnpm lint
```

## API overview

The API is rooted at `/api` and includes:

- `/api/auth`: registration, login, Google OAuth, profile, and password reset
- `/api/products`: product CRUD, product search, and inventory data
- `/api/orders`: order creation, retrieval, status updates, and deletion
- `/api/users`: user administration
- `/api/dashboard`: summary and inventory reporting data
- `/api-docs`: interactive Swagger documentation
- `/health`: service health status

For complete request schemas, authorization requirements, and response
examples, use the deployed Swagger documentation or the files in
`backend/docs/`.

## Security notes

- Keep `.env` and `.env.local` files out of version control.
- Use a strong, unique JWT secret in every deployed environment.
- Use a Gmail app password or another dedicated SMTP credential instead of a
  personal account password.
- Configure Google OAuth redirect URIs exactly for each environment.
- Restrict CORS origins to trusted frontend URLs.
- Never expose database connection strings or SMTP credentials in frontend
  code.

## License

This project is licensed under the MIT License. See `LICENSE` if present.
