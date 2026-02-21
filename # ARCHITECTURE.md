# ARCHITECTURE

## 1. System Boundaries
- **Internal**: Next.js App, Local SQLite/Postgres, Local File Optimization logic.
- **External**: Vercel Blob (Storage), Keycloak (Optional Auth) or NextAuth.

## 2. Architecture Style
**Modular Monolith**: All logic (Admin + Frontend) resides in one Next.js repo, but separated by route groups `(admin)` and `(public)`.

## 3. Rendering & Component Policy
- **Server Components**: All gallery fetching and group listings.
- **Client Components**: Lightbox, View Switcher, Admin Uploader.
- **Data Fetching**: Use `fetch` with Next.js cache tags; revalidate on Admin upload.

## 4. API Style
**REST (Next.js Route Handlers)**
| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/photos` | GET | List with pagination |
| `/api/admin/upload` | POST | Handle multi-part form data + Sharp processing |

## 5. Auth & Authorization
- **Admin Access**: Protected via `middleware.ts`. Simple JWT/Session-based auth.

## 6. Data Layer Rules
- **ORM**: Prisma or Drizzle for type-safe database queries.
- **Optimizations**: `next/image` is mandatory for all public-facing assets.

## 7. Non-Functional Requirements
- **Performance**: Image lazy loading is default.
- **Security**: Sanitize all metadata inputs to prevent XSS in image titles.

## 8. Constraints & Non-Goals
- No third-party CMS (Contentful/Sanity) to keep "VibeCoding" velocity high and costs low.
- No complex state management (Redux); only Zustand where necessary.