# SPEC

## 1. Objective
Create a high-impact, "Wow-effect" portfolio website for a commercial/still-life photographer. The platform must balance immersive visual storytelling with a robust administrative backend for content management and automated image optimization.

## 2. Context
The user is a professional photographer/artist specializing in physical subjects. The site needs to reflect creative precision while maintaining high performance (fast loading of high-res assets).

## 3. Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion (for the "Wow" transitions)
- **State Management**: Zustand (for gallery view preferences)
- **CMS/Admin**: Payload CMS (Self-hosted/Integrated) or custom Next.js Admin
- **Image Processing**: Sharp (for server-side optimization)
- **Database**: PostgreSQL (via Vercel Postgres or Neon)
- **Storage**: Vercel Blob or AWS S3

## 4. User Roles
| Role | Permissions |
| :--- | :--- |
| **Public Visitor** | View galleries, toggle layout modes, view fullscreen, contact. |
| **Admin** | Upload/delete photos, create/edit groups, tag photos, edit metadata. |

## 5. Core Entities
### Photo
| Field | Type | Constraints | Example |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | `uuid-v4` |
| url | String | Required | `/storage/img-1.webp` |
| thumbnail_url| String | Required | `/storage/thumb-1.webp` |
| title | String | Optional | "Glass & Shadow" |
| groupId | UUID | FK | `ref -> Group.id` |
| tags | String[] | Array | `["minimal", "lighting"]` |
| metadata | JSONB | - | `{ "width": 4000, "height": 6000 }` |

### Group (Gallery Category)
| Field | Type | Constraints | Example |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | `uuid-v4` |
| name | String | Required | "Commercial 2024" |
| displayMode | Enum | Grid / Carousel / Wall | "Wall" |

## 6. Scope
### In Scope (MVP)
- Interactive landing page with "Wow" transition.
- Three gallery modes: **Masonry Grid**, **Horizontal Filmstrip**, and **Immersive Fullscreen**.
- Admin Dashboard for bulk uploads.
- Auto-optimization pipeline (WebP conversion, resizing).
- Light/Dark mode (system preference).

### Out of Scope
- Client proofing galleries with passwords.
- E-commerce / Print shop.
- Blog functionality.

## 7. User Flows
1. **The Entry**: User lands on a minimalist splash -> Scroll/Click triggers a seamless Framer Motion expansion into the main gallery.
2. **Switching Views**: User clicks "Layout" icon -> Gallery morphs from a standard grid to a horizontal scroll without page reload.
3. **Admin Upload**: Admin selects 10 RAW/JPG files -> Server-side `sharp` creates thumbnails and optimized versions -> Admin adds tags in bulk.

## 8. Information Architecture
| Route | Description |
| :--- | :--- |
| `/` | Immersive Home / Active Gallery |
| `/work/[group]`| Filtered view by category |
| `/about` | Biography and contact |
| `/admin` | Login & Dashboard |

## 9. UI Specification (shadcn/ui)
- **Layout**: Max-width `screen-2xl` for galleries; Full-bleed for "Wow" mode.
- **Component Inventory**:
    - `ImageCanvas`: Uses `next/image` for blurred placeholders.
    - `ViewSwitcher`: Toggle group for layout modes.
    - `AdminUploader`: Drag-and-drop zone with progress bars.
    - `Lightbox`: Framer Motion powered modal for 1:1 scale viewing.

## 10. Functional Requirements
- [ ] Implement `sharp` middleware to downscale images > 2000px width automatically.
- [ ] Keyboard navigation (Arrows for gallery, Esc to close lightbox).
- [ ] "Contextual tagging" (Search photos by tag in admin).

## 11. Data & Mocking Plan
- Initial fixtures include 3 groups: "Still Life", "Architecture", "Experimental".
- Mock API delay of 800ms to test loading states (skeleton screens).

## 12. Acceptance Criteria
- [ ] Site scores > 90 on Lighthouse Performance (despite high-res images).
- [ ] Image upload of a 20MB file results in a < 500KB WebP asset.
- [ ] Transitions between gallery modes are fluid (no layout shift).

## 13. Edge Cases & Risks
- **High Res Files**: Users uploading 50MB+ files might timeout on serverless functions. Solution: Client-side pre-compression or increased timeout.
- **Safari Compatibility**: Framer Motion complex transforms sometimes flicker on older iOS.

## 14. Open Questions
- Should the "Wow" effect be 3D (Three.js) or 2D Motion? (Proposed: 2D Motion for better performance).

## 15. Future Improvements
- Video/Cinemagraph support.
- Password-protected "Client Folders".