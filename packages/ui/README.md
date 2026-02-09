# @nike/ui

Shared React component library with Nike brand styling.

## Components

| Component  | Description                              |
| ---------- | ---------------------------------------- |
| `Button`   | Primary, outline, accent, ghost variants |
| `Input`    | Form input with focus states             |
| `Card`     | Container with header/content/footer     |
| `Badge`    | Tags and status indicators               |
| `Skeleton` | Loading placeholders                     |

## Usage

```tsx
import { Button, Card, Badge, cn } from '@nike/ui';

function Example() {
  return (
    <Card>
      <Button variant="accent">Shop Now</Button>
      <Badge variant="success">In Stock</Badge>
    </Card>
  );
}
```

## Utilities

- `cn(...classes)` - Merges Tailwind classes with clsx + tailwind-merge
