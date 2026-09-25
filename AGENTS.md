# ManageMeals Web

SvelteKit frontend for [ManageMeals](https://managemeals.com) — a free recipe manager that scrapes recipes from websites. It talks to a separate backend API (`manage-meals-api`).

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

## Principles

- Minimize scope — match existing patterns; don't over-engineer
- Server-only API calls — never call the backend from client code
- No commits unless explicitly requested

## TypeScript & Style (applies to `**/*.{ts,svelte}`)

- Strict TypeScript — all shared interfaces in `src/lib/types.ts`
- Prefix interfaces with `I` (e.g. `IRecipe`, `IUser`)

### Prettier

- **Indentation:** Tabs
- **Quotes:** Single quotes
- **Trailing commas:** None
- **Line width:** 100 characters

Run `npm run format` before committing; `npm run check` for type errors.

### Env vars

- `PUBLIC_*` — exposed to client (title, PayPal, OAuth toggles, etc.)
- Server-only: `API_URL`, `COOKIE_*`, `ORIGIN`, `PASSWORD_MIN_LENGTH`, `INFRA_ENDPOINT_KEY`
- Never commit `.env` files

## Svelte 5 Components (applies to `**/*.svelte`)

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

- Use `{@render children?.()}` — **not** `<slot>`
- Use `$bindable()` for two-way binding
- Icons: `@iconify/svelte` (Phosphor icons, e.g. `ph:folder`)
- Forms: native SvelteKit actions with `use:enhance` from `$app/forms`
- Form responses: `IEnhanceFailRes` / `IEnhanceRes` from `$lib/types`

```svelte
<form method="POST" action="?/update" use:enhance>
```

Validate `.svelte` changes with `npm run check`.

## Server-Side Patterns (applies to `**/*.server.ts`, `src/lib/server/**`)

All backend API calls are server-side only via `apiClient` from `$lib/server/api/client`. Never call the backend directly from the client.

```typescript
// src/routes/(app)/recipes/+page.server.ts
import apiClient from '$lib/server/api/client';
import { getErrorMessage } from '$lib/errors';
import { fail } from '@sveltejs/kit';
import type { IEnhanceFailRes } from '$lib/types';

export const load = async ({ cookies }) => {
	const res = await apiClient(cookies.getAll()).get('/recipes');
	return { recipes: res.data };
};
```

- Pass `cookies.getAll()` to `apiClient()` for auth
- Use `getErrorMessage(e)` for Axios error messages
- Put shared interfaces in `src/lib/types.ts`
- Server-only code: `*.server.ts` or `src/lib/server/`

### Auth

- `hooks.server.ts` intercepts all requests, validates tokens, and auto-refreshes expired access tokens
- Tokens stored as HTTP-only cookies (names from env vars `COOKIE_ACCESS_TOKEN`, `COOKIE_REFRESH_TOKEN`)
- Authenticated user available via `event.locals.user`
- Public routes: `/`, `/auth/*`, `/infra/*`, `/share/*`
- All `(app)` routes are protected — redirect to `/auth/login` if unauthenticated

### Form actions

Uses native SvelteKit form actions — no external form library.

```typescript
export const actions = {
	update: async ({ request, cookies }) => {
		const name = (await request.formData()).get('name') as string;

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
