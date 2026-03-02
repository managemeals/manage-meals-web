# ManageMeals Web — Claude Code Context

## Project Overview

ManageMeals (https://managemeals.com) is a free recipe manager that scrapes recipes from websites. This is the SvelteKit frontend. It communicates with a separate backend API (`manage-meals-api`).

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # Type-check (svelte-check + tsc)
npm run lint             # Prettier + ESLint validation
npm run format           # Auto-format with Prettier
npm run test:unit        # Vitest unit tests
npm run test:integration # Playwright E2E tests
npm run test             # Both test suites
```

## Tech Stack

- **Framework:** SvelteKit 2 with Svelte 5 (runes API)
- **Styling:** Tailwind CSS 4 (PostCSS, no config file — configured via `app.css`)
- **Language:** TypeScript (strict mode)
- **HTTP client:** Axios (server-side only, via `src/lib/server/api/client.ts`)
- **Adapter:** `@sveltejs/adapter-node` (Node.js server)
- **Icons:** `@iconify/svelte` (Phosphor icons)
- **Date utils:** `date-fns`
- **Utilities:** `lodash-es` (debounce etc.)
- **Testing:** Vitest (unit), Playwright (E2E)
- **Payments:** `@paypal/paypal-js` (subscriptions)

## Project Structure

```
src/
├── app.css                  # Tailwind CSS entry point
├── app.d.ts                 # Global type declarations (locals.user)
├── hooks.server.ts          # Auth guard + token refresh
├── lib/
│   ├── actions/             # Svelte actions (clickOutside, tooltip)
│   ├── components/          # Reusable UI components
│   ├── server/
│   │   └── api/client.ts    # Axios API client factory
│   ├── constants.ts         # App-wide constants (WEEKDAYS)
│   ├── errors.ts            # getErrorMessage() for Axios errors
│   ├── stores.ts            # Svelte writable stores (sidebarLinks)
│   ├── types.ts             # All TypeScript interfaces (IRecipe, IUser, etc.)
│   └── utils.ts             # Helpers (sleep)
└── routes/
    ├── (app)/               # Protected routes — require auth
    ├── (auth)/              # Public auth routes (login, register, etc.)
    ├── (marketing)/         # Public marketing pages
    └── infra/               # Health check endpoints
```

### Key Routes (app)

`recipes/`, `categories/`, `tags/`, `meal-plans/`, `shopping-lists/`, `search/`, `charts/`, `settings/`, `admin/`, `share/`

Dynamic routes use `[slug]/` (e.g. `recipes/[slug]/`).

## Code Conventions

### Svelte 5 Runes

Always use runes syntax — no legacy `export let` or `$:` reactive statements.

```svelte
<script lang="ts">
  interface Props {
    label: string;
    checked?: boolean; // use $bindable for two-way binding
    children?: import('svelte').Snippet;
  }

  let { label, checked = $bindable(false), children }: Props = $props();

  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

{@render children?.()}
```

Use `@render children?.()` — **not** `<slot>`.

### Code Style (Prettier)

- **Indentation:** Tabs
- **Quotes:** Single quotes
- **Trailing commas:** None
- **Line width:** 100 characters

### TypeScript

- Strict mode enabled
- All interfaces in `src/lib/types.ts`
- Server-only code goes in `src/lib/server/` or files named `*.server.ts`

## API Pattern

All backend API calls are server-side only. Never call the backend directly from the client.

```typescript
// src/routes/(app)/recipes/+page.server.ts
import { apiClient } from '$lib/server/api/client';

export const load: PageServerLoad = async ({ cookies }) => {
  const res = await apiClient(cookies.getAll()).get('/recipes');
  return { recipes: res.data };
};
```

Use `getErrorMessage(e)` from `$lib/errors` to extract readable messages from Axios errors.

## Authentication

- **`hooks.server.ts`** intercepts all requests, validates tokens, auto-refreshes expired access tokens
- Tokens stored as HTTP-only cookies (names from env vars `COOKIE_ACCESS_TOKEN`, `COOKIE_REFRESH_TOKEN`)
- Authenticated user available via `event.locals.user`
- Public routes: `/`, `/auth/*`, `/infra/*`, `/share/*`
- All `(app)` routes are protected — redirect to `/auth/login` if unauthenticated

## Form Handling

Uses native SvelteKit form actions — no external form library.

```typescript
// +page.server.ts
export const actions = {
  update: async ({ request, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;

    if (!name) {
      return fail(400, { errors: { name: 'Required' }, inputs: { name } });
    }

    await apiClient(cookies.getAll()).patch('/settings', { name });
    return { message: 'Saved', messageType: 'success' };
  }
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
</script>

<form method="POST" action="?/update" use:enhance>
  ...
</form>
```

Error/success responses follow `IEnhanceFailRes` / `IEnhanceRes` interfaces in `src/lib/types.ts`.

## Environment Variables

### Public (exposed to client, prefix `PUBLIC_`)

| Variable | Description |
|---|---|
| `PUBLIC_MAIN_TITLE` | App title ("ManageMeals") |
| `PUBLIC_MOCK_INSTANCE` | Demo mode (yes/no) |
| `PUBLIC_PAYPAL_APP_CLIENT_ID` | PayPal client ID |
| `PUBLIC_PAYPAL_PLAN_ID` | PayPal subscription plan |
| `PUBLIC_PREMIUM_PRICE` | Subscription price |
| `PUBLIC_SHOW_SUBSCRIPTION_PAGE` | Show/hide subscriptions |
| `PUBLIC_EMAIL_VERIFY_ENABLED` | Email verification toggle |
| `PUBLIC_UMAMI_ANALYTICS_ENABLED` | Analytics toggle |
| `PUBLIC_SHOW_AI_PROMO` | AI promo banner |
| `PUBLIC_ENABLE_GOOGLE_OAUTH` | Google OAuth toggle |
| `PUBLIC_GOOGLE_OAUTH_URL` | Google OAuth callback URL |

### Private (server-only)

| Variable | Description |
|---|---|
| `API_URL` | Backend API base URL (e.g. `http://localhost:3000/v1`) |
| `COOKIE_ACCESS_TOKEN` | Access token cookie name |
| `COOKIE_REFRESH_TOKEN` | Refresh token cookie name |
| `COOKIE_ACCESS_TOKEN_EXPIRE_SEC` | Access token TTL |
| `COOKIE_REFRESH_TOKEN_EXPIRE_SEC` | Refresh token TTL |
| `PASSWORD_MIN_LENGTH` | Min password length |
| `INFRA_ENDPOINT_KEY` | Secret for infra endpoints |
| `ORIGIN` | App origin URL |
