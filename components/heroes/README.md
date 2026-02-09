# Hero Section Management System

This system allows admins to manage multiple hero section variations on the homepage and easily switch between them.

## Overview

The homepage hero section can now display different designs that you can switch between from the admin panel.

## Current Hero Variants

### Variant 1 - Light Theme (Default)
- **Design**: Traditional bakery feel with warm, light colors
- **Theme**: Pastel pink, orange gradient background
- **Features**: Hero carousel, floating decorative blobs
- **Best for**: Welcoming, friendly, classic bakery aesthetic

### Variant 2 - Dark Theme
- **Design**: Modern, premium, artistic feel
- **Theme**: Dark background (#1a0f0e) with gradient text
- **Features**: Product showcase cards with badges, decorative rings
- **Best for**: Upscale, contemporary, luxury branding

### Variant 3 & 4
- Coming soon! You can create these by adding new components

## How to Switch Hero Sections (Admin)

1. Navigate to **Admin Dashboard** → **Settings**
2. Click on the **"Hero Selection"** tab
3. Choose your preferred hero design
4. Click **"Save Settings"**
5. Refresh the homepage to see the change

## How to Add New Hero Variants

### Step 1: Create a New Hero Component

Create a new file in `components/heroes/`:

```tsx
// components/heroes/HeroVariant3.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroVariant3() {
  return (
    <section className="...">
      {/* Your hero design here */}
    </section>
  );
}
```

### Step 2: Register the Variant

Update `components/heroes/HeroSelector.tsx`:

```tsx
import HeroVariant3 from "./HeroVariant3";

const HERO_VARIANTS = {
  variant1: HeroVariant1,
  variant2: HeroVariant2,
  variant3: HeroVariant3, // Add your new variant
};
```

### Step 3: Update Admin UI

Add the new option in `app/admin/settings/page.tsx`:

```jsx
<label className={/* ... */}>
  <input
    type="radio"
    name="hero"
    value="variant3"
    checked={activeHero === 'variant3'}
    onChange={(e) => setActiveHero(e.target.value)}
  />
  {/* Your variant preview */}
</label>
```

### Step 4: Update API Validation

In `app/api/admin/settings/hero/route.ts`, add "variant3" to the valid IDs:

```ts
const validHeroIds = ["variant1", "variant2", "variant3", "variant4"];
```

## Files Structure

```
components/heroes/
├── README.md           # This file
├── HeroSelector.tsx    # Main component that selects hero
├── HeroVariant1.tsx    # Light theme hero
└── HeroVariant2.tsx    # Dark theme hero

app/
├── page.tsx            # Homepage using HeroSelector
└── api/admin/settings/hero/
    └── route.ts        # API to save hero selection

prisma/
└── schema.prisma       # SiteSettings model

app/admin/settings/
└── page.tsx            # Admin UI to select hero
```

## Database

The selected hero is stored in the `SiteSettings` table:

```prisma
model SiteSettings {
  id           String   @id @default("main")
  activeHeroId String   @default("variant1")
  updatedAt    DateTime @updatedAt
}
```

## Tips

- **Test before deploying**: Always preview hero changes on localhost before going live
- **Mobile-first**: Ensure your hero designs are responsive
- **Performance**: Optimize images used in hero sections
- **Consistency**: Keep the same CTA buttons across all variants for UX consistency
- **Seasonal themes**: You can create variant3 for festivals, variant4 for special occasions

## Future Ideas

- **Time-based rotation**: Automatically switch heroes based on time of day or season
- **A/B testing**: Track which hero converts better
- **User preferences**: Let returning customers choose their preferred theme
- **Animation**: Add entrance animations for hero sections
