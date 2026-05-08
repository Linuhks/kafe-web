## Why

All functional features (catalog, cart, auth, barista queue, admin CRUD, inventory) are implemented but have never been validated end-to-end as a cohesive system. Environment configuration is also undocumented, creating onboarding friction.

## What Changes

- Add `.env.local.example` documenting required environment variables
- Validate all five user-role flows (anonymous, client, barista, admin) end-to-end
- Verify middleware route protection for every role boundary
- Confirm cart sessionStorage persistence, toast notifications, skeleton loaders, and form dirty-state warnings work across all pages
- Validate pagination, status badge colors, and `next/image` remote patterns

## Capabilities

### New Capabilities

- `env-configuration`: Documents and scaffolds required environment variables via `.env.local.example`

### Modified Capabilities

<!-- No existing spec requirements are changing — this task validates existing implementations -->

## Impact

- `proxy.ts` — route protection assertions confirmed or corrected
- `app/**` — any discovered bugs fixed in place
- `.env.local.example` — new file at repo root
- No API or schema changes; no new dependencies
