# Nike Store - E-Commerce Platform

A production-ready, MAANG-level Nike shoe e-commerce application built with modern web technologies.

## 🏗️ Architecture

```
nike-store/
├── apps/
│   └── web/                    # Next.js 14 Storefront
│       ├── app/                # App Router pages
│       │   ├── (shop)/         # Public storefront (Home, Product, Cart)
│       │   ├── admin/          # Admin Dashboard (Protected)
│       │   └── api/            # API routes
│       ├── components/         # React components
│       └── lib/                # Utilities & stores
├── packages/
│   ├── database/               # Prisma & PostgreSQL
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # ESLint configuration
│   └── tsconfig/               # TypeScript configs
```

## 🛠️ Tech Stack

| Category          | Technology              |
| ----------------- | ----------------------- |
| **Framework**     | Next.js 14 (App Router) |
| **Language**      | TypeScript              |
| **Styling**       | Tailwind CSS            |
| **Database**      | PostgreSQL (Supabase)   |
| **ORM**           | Prisma                  |
| **State**         | Zustand                 |
| **Data Fetching** | TanStack Query          |
| **Auth**          | NextAuth.js             |
| **Payments**      | Stripe                  |
| **Monorepo**      | Turborepo               |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 10+
- PostgreSQL database (Supabase recommended)
- Stripe Account (for payments)

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   # Copy example files
   cp apps/web/.env.example apps/web/.env
   cp packages/database/.env.example packages/database/.env
   ```

3. **Configure your database:**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Copy connection strings to `.env` files

4. **Generate Prisma client & push schema:**

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Seed the database:**

   ```bash
   npm run db:seed
   ```

6. **Start development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

| Script              | Description                 |
| ------------------- | --------------------------- |
| `npm run dev`       | Start development server    |
| `npm run build`     | Build for production        |
| `npm run start`     | Start production server     |
| `npm run lint`      | Lint all packages           |
| `npm run format`    | Format code with Prettier   |
| `npm run db:studio` | Open Prisma Studio          |
| `npm run db:seed`   | Seed database with products |

## 📁 Project Structure

### Apps

- **`apps/web`** - Next.js storefront with:
  - **`(shop)`**: Public e-commerce routes
  - **`admin`**: Protected admin dashboard
  - **`api`**: Webhooks and endpoints

### Packages

- **`@nike/database`** - Database layer with Prisma ORM
- **`@nike/ui`** - Shared component library (Button, Card, Input, Badge, Skeleton)
- **`@nike/eslint-config`** - Shared ESLint configuration
- **`@nike/tsconfig`** - Shared TypeScript configurations

## 🎨 Features

### Storefront

- ✅ Homepage with interactive hero section
- ✅ Product listing with advanced filters
- ✅ Product details with variants (Size/Color)
- ✅ Shopping cart with persistent state (Zustand)
- ✅ Secure Checkout with Stripe

### Admin Dashboard

- ✅ Overview Analytics (Revenue, Orders, Customers)
- ✅ Product Management (CRUD, Stock control)
- ✅ Order Management (Status updates)
- ✅ Customer Insights
- ✅ Settings & Configuration

### Infrastructure

- ✅ NextAuth Authentication (Google/Credentials)
- ✅ Role-based Access Control (Admin/User)
- ✅ Responsive "Glassmorphism" Design System
- ✅ Docker Support

## 🔒 Environment Variables

### apps/web/.env

```env
DATABASE_URL=           # Supabase connection string
NEXTAUTH_URL=           # App URL (http://localhost:3000)
NEXTAUTH_SECRET=        # Generate with: openssl rand -base64 32
```

### packages/database/.env

```env
DATABASE_URL=           # Supabase pooled connection
DIRECT_URL=             # Supabase direct connection
```

## 📄 License

MIT
