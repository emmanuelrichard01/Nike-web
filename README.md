# Nike Store - E-Commerce Platform

A production-ready, MAANG-level Nike shoe e-commerce application built with modern web technologies.

## 🏗️ Architecture

```
nike-store/
├── apps/
│   └── web/                    # Next.js 14 Storefront
│       ├── app/                # App Router pages
│       │   ├── api/            # API routes
│       │   ├── cart/           # Cart page
│       │   └── products/       # Product pages
│       ├── components/         # React components
│       │   ├── home/           # Homepage components
│       │   ├── layout/         # Header, Footer
│       │   └── product/        # Product cards, grids
│       └── lib/                # Utilities & stores
│           └── store/          # Zustand state management
├── packages/
│   ├── database/               # Prisma & PostgreSQL
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # ESLint configuration
│   └── tsconfig/               # TypeScript configs
```

## 🛠️ Tech Stack

| Category          | Technology                |
| ----------------- | ------------------------- |
| **Framework**     | Next.js 14 (App Router)   |
| **Language**      | TypeScript                |
| **Styling**       | Tailwind CSS              |
| **Database**      | PostgreSQL (Supabase)     |
| **ORM**           | Prisma                    |
| **State**         | Zustand                   |
| **Data Fetching** | TanStack Query            |
| **Auth**          | NextAuth.js (coming soon) |
| **Monorepo**      | Turborepo                 |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 10+
- PostgreSQL database (Supabase recommended)

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
  - Server-side rendering
  - Streaming with Suspense
  - API routes for products/categories
  - Responsive design

### Packages

- **`@nike/database`** - Database layer with Prisma ORM
- **`@nike/ui`** - Shared component library (Button, Card, Input, Badge, Skeleton)
- **`@nike/eslint-config`** - Shared ESLint configuration
- **`@nike/tsconfig`** - Shared TypeScript configurations

## 🎨 Features

### Implemented (MVP)

- ✅ Homepage with hero section
- ✅ Product listing with category filters
- ✅ Product detail pages with size/color selection
- ✅ Shopping cart with persistent state
- ✅ Responsive design
- ✅ Nike brand design system

### Coming Soon

- 🔄 NextAuth authentication
- 🔄 Checkout flow
- 🔄 Order management
- 🔄 Admin dashboard
- 🔄 E2E tests with Playwright

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
