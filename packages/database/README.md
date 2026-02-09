# @nike/database

Prisma database layer for the Nike Store.

## Models

- **User** - Customer accounts with orders, cart, reviews
- **Product** - Shoes with name, description, price, category
- **ProductVariant** - Size/color/SKU combinations with stock
- **Category** - Hierarchical product categorization
- **Cart/CartItem** - User shopping cart
- **Order/OrderItem** - Completed purchases
- **Review** - Product ratings and comments

## Scripts

```bash
npm run generate    # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Seed with sample data
```

## Usage

```typescript
import { prisma } from '@nike/database';

const products = await prisma.product.findMany({
  include: { category: true, variants: true },
});
```
