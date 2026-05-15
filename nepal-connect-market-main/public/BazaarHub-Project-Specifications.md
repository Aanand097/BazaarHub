# BazaarHub - Project Specifications

**Date:** March 2, 2026  
**Platform:** Web Application (React + TypeScript)

---

## 1. Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend UI framework |
| TypeScript | Type-safe JavaScript |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | UI component library |
| Framer Motion | Animations & transitions |
| React Router v6 | Client-side routing |
| TanStack React Query | Server state management |
| Lovable Cloud | Backend (database, auth, storage, edge functions) |

---

## 2. Pages (16 Total)

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | Home | `/` | Banner carousel, categories sidebar, trending/latest ads, stats |
| 2 | Browse | `/browse` | Search & filter listings by category, location, price |
| 3 | Ad Detail | `/ad/:id` | Full ad view with images, seller info, chat button |
| 4 | Post Ad | `/post-ad` | Create new listing with images, price, category |
| 5 | Login | `/login` | Email/password sign in |
| 6 | Register | `/register` | Account creation with name, email, password |
| 7 | Dashboard | `/dashboard` | User's ads, saved items, profile management |
| 8 | Chat | `/chat` | Real-time messaging between buyers & sellers |
| 9 | Admin Panel | `/admin` | Banner management, ad moderation, boost controls |
| 10 | About | `/about` | Mission, team, stats, how it works |
| 11 | Safety Tips | `/safety-tips` | Buyer/seller safety guidelines |
| 12 | Posting Rules | `/posting-rules` | Ad content rules |
| 13 | FAQ | `/faq` | Frequently asked questions |
| 14 | Terms | `/terms` | Terms of use + disclaimer |
| 15 | Privacy | `/privacy` | Privacy policy |
| 16 | Contact | `/contact` | Phone, email, office info |

---

## 3. Database Schema (10 Tables)

### 3.1 profiles
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| full_name | text | No | '' |
| avatar_url | text | Yes | — |
| phone | text | Yes | — |
| location | text | Yes | — |
| bio | text | Yes | — |
| rating | numeric | Yes | 0 |
| verified | boolean | Yes | false |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

### 3.2 user_roles
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| role | app_role (enum) | No | — |

**Enum values:** admin, moderator, user

### 3.3 ads
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| title | text | No | — |
| description | text | Yes | — |
| price | numeric | No | — |
| currency | text | Yes | 'NPR' |
| category_id | uuid | Yes | — |
| subcategory_id | uuid | Yes | — |
| condition | text | Yes | — |
| location | text | Yes | — |
| images | text[] | Yes | '{}' |
| negotiable | boolean | Yes | false |
| featured | boolean | Yes | false |
| boosted | boolean | Yes | false |
| status | text | Yes | 'pending' |
| views | integer | Yes | 0 |
| reports_count | integer | Yes | 0 |
| expires_at | timestamptz | Yes | now() + 30 days |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

### 3.4 categories
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | text | No | — |
| icon | text | Yes | '📦' |
| sort_order | integer | Yes | 0 |
| created_at | timestamptz | No | now() |

### 3.5 subcategories
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | text | No | — |
| category_id | uuid | No | — |

### 3.6 banners
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| title | text | No | — |
| description | text | Yes | — |
| image_url | text | No | — |
| link_url | text | Yes | — |
| ad_id | uuid | Yes | — |
| is_active | boolean | No | true |
| sort_order | integer | No | 0 |
| starts_at | timestamptz | Yes | now() |
| expires_at | timestamptz | Yes | — |
| created_by | uuid | No | — |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

### 3.7 chat_threads
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| ad_id | uuid | Yes | — |
| buyer_id | uuid | No | — |
| seller_id | uuid | No | — |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

### 3.8 chat_messages
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| thread_id | uuid | No | — |
| sender_id | uuid | No | — |
| content | text | No | — |
| image_url | text | Yes | — |
| seen | boolean | Yes | false |
| created_at | timestamptz | No | now() |

### 3.9 saved_ads
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| ad_id | uuid | No | — |
| created_at | timestamptz | No | now() |

### 3.10 ad_reports
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| ad_id | uuid | No | — |
| reporter_id | uuid | No | — |
| reason | text | No | — |
| description | text | Yes | — |
| status | text | Yes | 'pending' |
| created_at | timestamptz | No | now() |

---

## 4. Authentication & Security

- Email/password signup & login
- Auto-profile creation via database trigger (`handle_new_user`)
- Role-based admin access via `user_roles` table
- Security definer function: `has_role(user_id, role)`
- Row Level Security (RLS) enabled on ALL tables
- Admin-only access to banner management, ad moderation, boost controls

### RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Everyone | Own | Own | ✗ |
| user_roles | Own + Admin | Admin | Admin | Admin |
| ads | Approved/Own/Admin | Own | Own/Admin | Own/Admin |
| categories | Everyone | Admin | Admin | Admin |
| subcategories | Everyone | Admin | Admin | Admin |
| banners | Active only + Admin | Admin | Admin | Admin |
| chat_threads | Participants | Buyer | ✗ | ✗ |
| chat_messages | Participants | Participants | Participants | ✗ |
| saved_ads | Own | Own | ✗ | Own |
| ad_reports | Own/Admin | Own | Admin | ✗ |

---

## 5. Key Features

### 5.1 Banner Carousel (Homepage)
- Auto-rotating sponsored banners
- Admin-managed via Admin Panel
- Navigation dots & prev/next controls
- Fallback hero UI when no active banners

### 5.2 Product Boosting
- Admin can toggle `boosted` and `featured` status on ads
- Boosted ads get extra visibility

### 5.3 Categories System
- Icon-based category sidebar on desktop
- Grid layout on mobile
- Subcategory support

### 5.4 Real-time Chat
- Buyer-seller messaging system
- Thread-based conversations linked to ads
- Image sharing support
- Read/seen status tracking

### 5.5 Ad Management
- Create, edit, delete listings
- Image upload via `ad-images` storage bucket
- Status workflow: pending → approved
- 30-day auto-expiry

### 5.6 Search & Browse
- Query-based search from navbar
- Category filtering
- Location & price filters

### 5.7 Admin Panel
- Overview dashboard with stats
- Ad moderation (approve/reject)
- Banner ads management
- Boost & featured controls
- User reports management

### 5.8 Legal Framework
- Terms of Use with disclaimer
- Privacy Policy
- Safety Tips
- Posting Rules
- "Buy & Sell at Your Own Risk" disclaimer

---

## 6. Storage

| Bucket | Public | Purpose |
|--------|--------|---------|
| ad-images | Yes | Listing photos uploaded by users |

---

## 7. Design System

- Custom CSS tokens (gradients, shadows, glass effects)
- Dark/light mode support via `next-themes`
- Semantic color tokens: `--primary`, `--secondary`, `--accent`, `--muted`, `--destructive`
- Font: Custom display font via `font-display` class
- Responsive: Mobile-first with desktop enhancements
- Glass morphism navbar with sticky positioning

---

## 8. Dependencies (Key Packages)

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-router-dom | ^6.30.1 | Routing |
| @tanstack/react-query | ^5.83.0 | Data fetching |
| @supabase/supabase-js | ^2.98.0 | Backend client |
| framer-motion | ^12.34.3 | Animations |
| tailwindcss-animate | ^1.0.7 | CSS animations |
| sonner | ^1.7.4 | Toast notifications |
| lucide-react | ^0.462.0 | Icons |
| recharts | ^2.15.4 | Charts (admin) |
| zod | ^3.25.76 | Schema validation |
| react-hook-form | ^7.61.1 | Form handling |

---

*Document generated for BazaarHub project — March 2, 2026*
