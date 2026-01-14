# Nike Store Monorepo

## Overview

This is a production-ready, scalable Nike shoe e-commerce application built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, and Prisma.

## Structure

The project follows a strict monorepo structure:

```
nike-store/
├── apps/
│   └── web/          # Next.js Storefront
├── packages/
│   ├── database/     # Prisma & Database client
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── eslint-config/# Shared ESLint configs
│   └── tsconfig/     # Shared TS configs
```

## Tech Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (via Prisma)
- **State**: Zustand + TanStack Query
- **Auth**: Clerk / Auth.js
- **Payment**: Stripe

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Set up environment variables:
    - Copy `.env.example` to `.env` in `apps/web` and `packages/database`.

3.  Run development server:
    ```bash
    npm run dev
    ```
