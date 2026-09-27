# My Portfolio — Next.js

A modern, full-stack personal portfolio built with the **Next.js App Router**, featuring a public showcase site and a complete **admin panel** to manage all content from a PostgreSQL database.

## ✨ Features

### Public site
- **Home** — hero section (greeting + intro) and "The Journey & Learning Phases" timeline
- **Projects** — project cards with cover images and detail pages featuring an animated image gallery (Framer Motion slides, thumbnails, arrows, keyboard navigation, auto-advance with progress bar that pauses on hover)
- **Resume** — profile, education, experience, skills, and certifications
- **Contact** — contact form that stores messages in the database, plus social links
- **AI Chat Assistant** — floating chat bubble that answers questions about Akim using the site's actual content (pulled from the database into the system prompt), with predefined quick questions, streaming responses, and chat reset on close
- Dark glassmorphism UI with Framer Motion animations, a canvas cursor, and a scroll-driven WebGL 3D background (a low-poly parachutist that descends with the page scroll — rendered at 50% opacity on the left edge so it floats in front of the content without blocking clicks)
- **Page transitions** — every internal navigation animates via the native browser View Transitions API (no extra dependencies): a crossfade by default, a directional slide when moving deeper into the site ("forward" links: navbar items, project cards) and a reverse slide on "back" links (logo, *Return to Homepage*, *Back to Projects*). The whole transition is capped at 240ms because the browser blocks painting while one runs. The navbar and floating buttons are excluded from the transition so they hold still as a spatial anchor while the content slides past. Respects `prefers-reduced-motion` and falls back to instant navigation in browsers without support
- **Prefetched navigation** — the primary nav links and project cards use `<Link prefetch>`, so the destination is already in the router cache by the time they are clicked and the page swaps without a server round trip. Note that prefetching is disabled in `next dev`, so navigation is only instant in a production build (`npm run build && npm start`)
- **Scroll-to-top button** — floating button on the bottom-right that appears after scrolling and smooth-scrolls back to the top

### Admin panel (`/admin`)
Protected by a secure, cookie-based authentication system. Fully CRUD-able content:

- **Dashboard** — visitor message inbox with total count and per-message **delete** (with confirmation)
- **Hero** — edit greeting + introduction
- **Journey** — add / edit / delete / reorder timeline entries
- **Projects** — add / edit / delete / reorder projects (including gallery images, one URL per line)
- **Resume** — profile & summary, education, experience, skills, certifications (add / edit / delete / reorder)
- **Contact** — page introduction + social links (add / edit / delete / reorder)

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, Three.js (React Three Fiber), native View Transitions API |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 with `@prisma/adapter-pg` (driver adapters) |
| AI | Vercel AI SDK 7 (`ai`, `@ai-sdk/google`, `@ai-sdk/react`) — Google Gemini 3 Flash |
| Auth | scrypt password hashing + signed HMAC session tokens (Web Crypto, `httpOnly` cookies — safe for the Node.js proxy runtime) |
| Linting | ESLint (eslint-config-next) |

## 📁 Project Structure

```
app/
├── (public)/            # Public-only chrome — navbar + AI chat bubble (layout)
│   └── (site)/          # Public pages (home, projects, resume, contact)
├── login/               # Admin login page (bare — no public chrome)
├── admin/               # Admin panel pages (no public chrome — its own shell)
│   ├── dashboard/       # Message inbox
│   ├── hero/            # Hero content editor
│   ├── journey/         # Journey timeline editor
│   ├── projects/        # Projects editor
│   ├── resume/          # Resume editors (profile, education, experience, skills, certifications)
│   └── contact/         # Contact intro + social links editor
├── api/chat/            # AI chat API route (Gemini + portfolio context)
└── db-controller/       # Server actions (auth, content, messages)
components/
├── AdminLayout.tsx      # Admin shell (sidebar, topbar, user dropdown, logout)
├── admin/               # Reusable admin UI (ActionForm, DeleteButton, MoveButton, ui.tsx, ...)
├── Navbar.tsx           # Fixed glassy navbar for the public site
├── ViewTransitions.tsx  # Page transition engine (View Transitions API wrapper around Next.js navigation)
├── LinkPendingHint.tsx  # Inline pending state for a slow <Link> navigation (must be rendered inside a Link)
├── CanvasCursor.tsx     # Custom canvas cursor overlay
├── Scroll3DBackground.tsx  # Scroll-driven WebGL 3D scene (React Three Fiber)
├── ScrollToTopButton.tsx   # Floating scroll-to-top button
├── FloatingChatButton.tsx  # Floating AI chat bubble (useChat + quick questions)
├── ProjectGallery.tsx   # Animated project image gallery (autoplay, thumbnails)
├── DeleteMessageButton.tsx # Message delete with confirmation
├── LoginForm.tsx        # Login form (useActionState)
├── ContactForm.tsx      # Public contact form
└── ...                  # Other public site components
lib/
├── prisma.ts            # Prisma client (Pg driver adapter)
├── password.ts          # scrypt hashing + verification
└── session.ts           # Signed HMAC session token create/verify
prisma/
├── schema.prisma        # Database schema
└── migrations/          # SQL migrations (applied via pg script, see note below)
proxy.ts                   # Session verification for /admin routes (proxy convention, Next 16)
prisma.config.ts           # Prisma CLI configuration
```

## 🗄 Database Schema

- `Project` — title, type, year, description, stacks, features, long-form sections, gallery images, order
- `Message` — visitor contact form submissions (name, email, message)
- `HeroContent` — homepage greeting + description
- `Journey` — timeline entries (year, title, description, status, type, tech, order)
- `Education` — period, degree, description, order
- `Experience` — title, period, company, isLatest, highlights, order
- `Skill` — name, order
- `Certification` — title, provider, year, logoText, verifyUrl, order
- `SocialLink` — name, url, order
- `ContentSetting` — key/value content settings (resume profile, page intros)
- `User` — admin accounts (email, name, passwordHash)

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 20+
- A PostgreSQL database (e.g. Supabase)

### 2. Environment variables

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/database?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/database"
SESSION_SECRET="<random 64-char hex string>"
GOOGLE_GENERATIVE_AI_API_KEY="<Google AI Studio API key>"
```

- `DATABASE_URL` / `DIRECT_URL` — connection strings for Prisma (Supabase pooler config shown above).
- `SESSION_SECRET` — used to sign admin session tokens. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- `GOOGLE_GENERATIVE_AI_API_KEY` — required for the chat assistant (get one at [Google AI Studio](https://aistudio.google.com/)). The model used is `gemini-3-flash-preview` (see `app/api/chat/route.ts`).

### 3. Install & setup

```bash
npm install
npx prisma generate
npx prisma db push   # or: npx prisma migrate dev
npm run seed         # seeds content + admin user
```

> Note: this project uses Prisma 7 with driver adapters — `@prisma/client` is instantiated with the `pg` Pool adapter (see `lib/prisma.ts`). Schema changes are stored as SQL files in `prisma/migrations/` and applied by running the SQL directly against the database (then inserting the corresponding `_prisma_migrations` row), since `prisma migrate dev` is unavailable with the driver-adapter setup.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and [http://localhost:3000/login](http://localhost:3000/login) for the admin panel.

### 5. Default admin account (from seed)

```
Email:    admin@example.com
Password: admin123
```

**Change this password in production** by updating the `User` table or implementing a password-change flow.

## 🔐 Authentication & Security

- Passwords are hashed with **scrypt** and a random per-user salt (`salt:hash` format).
- Sessions use a signed token (`{userId, exp}` + HMAC signature) stored in an `httpOnly`, `SameSite=Lax` cookie.
- `proxy.ts` verifies the token signature and expiry on all `/admin/*` routes and redirects unauthenticated/forged requests to `/login`.
- Server actions (`auth-actions.ts`, `content-actions.ts`) handle all writes server-side; they catch Prisma `P2002`-style errors and re-throw Next.js redirects correctly after the (async) Prisma calls (`rethrowRedirect`).

## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database content + admin user (`prisma/seed.ts`) |

## 📄 License

Private project. All rights reserved.
