# Nike Store - Premium E-Commerce Platform

![Nike Store Banner](/public/opengraph-image.png)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)

</div>

---

## ⚡ Overview

**Nike Store** is a production-grade, full-stack e-commerce application engineered to replicate the premium digital experience of top-tier retail brands. Built on a modern **Next.js 14** monorepo architecture, it features a high-performance storefront, a robust admin dashboard, and seamless payment integration.

**Why this project?**
This codebase serves as a reference implementation for complex, scalable web applications, demonstrating best practices in:

- **Server-Side Rendering (SSR) & Streaming**
- **Edge-ready Database Patterns**
- **Advanced State Management**
- **Secure Payment Flows**

## 🏗️ Architecture

The project follows a **Turborepo** monorepo structure to ensure modularity and scalability.

```mermaid
graph TD
    User((User))
    Admin((Admin))

    subgraph Client
        Storefront[Storefront (Next.js)]
        Dashboard[Admin Dashboard (Next.js)]
    end

    subgraph Server
        API[API Routes]
        Auth[NextAuth.js]
        DB[(PostgreSQL + Prisma)]
        StripeAPI[Stripe API]
    end

    User -->|Browses| Storefront
    User -->|Pays| StripeAPI
    Admin -->|Manages| Dashboard

    Storefront -->|Fetches Data| API
    Dashboard -->|CRUD Ops| API

    API -->|Queries| DB
    API -->|Authenticates| Auth
    StripeAPI -->|Webhooks| API
```

### Directory Structure

```bash
nike-store/
├── apps/
│   └── web/                    # The Main Application
│       ├── app/
│       │   ├── (shop)/         # Public Shop Routes (Isolated Layout)
│       │   ├── admin/          # Protected Admin Routes (Isolated Layout)
│       │   └── api/            # Server-side API Endpoints
│       ├── components/         # Atomic Design Components
│       └── lib/                # Shared Logic (Auth, Stripe, Utils)
├── packages/
│   ├── database/               # Shared Type-Safe Database Module
│   ├── ui/                     # Design System (Radix UI + Tailwind)
│   └── config/                 # Shared Configs (ESLint, TSConfig)
```

## ✨ Key Features

### 🛒 Immersive Storefront

- **Performance First**: Built on Next.js App Router with React Server Components for blazing fast page loads.
- **Dynamic UX**: "Liquid" animations and micro-interactions powered by Framer Motion.
- **Advanced Filtering**: Filter products by category, size, color, and price range in real-time.
- **Persistent Cart**: Robust cart management using Zustand, persisted to local storage.

### 🛡️ Admin Command Center

- **Glassmorphism Console**: A visually stunning dashboard for managing your business.
- **Product Management**: Full CRUD capabilities for products and variants (SKUs).
- **Order Fulfillment**: Track payments, shipping status, and order timeline.
- **Analytics**: Real-time overview of revenue, sales velocity, and customer growth.

### 💳 Secure Payments

- **Stripe Integration**: Fully integrated Stripe Checkout flow.
- **Webhook Handling**: Robust webhook processing with signature verification.
- **Order Verification**: Fallback mechanisms to ensure order integrity even if webhooks fail.

## 🚀 Getting Started

Follow these steps to spin up your local instance.

### 1. Prerequisites

Ensure you have the following installed:

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (optional, for local DB)
- Stripe Account (for API keys)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nike-store.git

# Install dependencies via Turbo
npm install
```

### 3. Environment Configuration

Create `.env` files for both the web app and database package.

**`apps/web/.env`**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nike_db"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 4. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push Schema to Database
npm run db:push

# Seed Database with Demo Data
npm run db:seed
```

### 5. Launch

```bash
npm run dev
```

Visit `http://localhost:3000` to see the storefront.
Visit `http://localhost:3000/admin` to access the dashboard.

## 📦 Script Reference

| Command             | Action                                             |
| :------------------ | :------------------------------------------------- |
| `npm run dev`       | Starts the entire monorepo in development mode.    |
| `npm run build`     | Builds apps and packages for production.           |
| `npm run lint`      | Runs ESLint across all workspaces.                 |
| `npm run db:studio` | Opens Prisma Studio to visualize database records. |

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
