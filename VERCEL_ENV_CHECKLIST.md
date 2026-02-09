# Vercel Environment Variables Checklist

# Copy these to your Vercel project settings

# =============================================================================

# DATABASE (Supabase) - REQUIRED

# =============================================================================

DATABASE_URL=
DIRECT_URL=

# =============================================================================

# AUTHENTICATION (NextAuth) - REQUIRED

# =============================================================================

NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=

# OAuth Providers

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# =============================================================================

# PAYMENTS (Stripe) - REQUIRED for checkout

# =============================================================================

STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# =============================================================================

# APP CONFIG

# =============================================================================

NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
