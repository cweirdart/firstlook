# First Look — Decision Log

Running log of all decisions, directions, and open questions so nothing gets lost between sessions.

---

## Product Identity

| Decision | Detail | Date |
|----------|--------|------|
| **Not Private Party** | This is a separate product from privateparty.app. Own brand, own identity. | 2026-04-05 |
| **Name: First Look** | Product name decided. Domain: firstlook.love. Chosen for emotional resonance with wedding culture ("first look" = intimate moment), distinctiveness from competitor naming patterns (avoids "Guest/Wed+noun" formula), and clean .love TLD that reinforces brand. | 2026-04-05 |
| **Real product** | Shipping to real users, not a prototype/experiment. | 2026-04-05 |
| **Pricing** | $99 one-time fee (from landing page). Needs revisiting once product scope solidifies. | 2026-04-05 |

## Design Direction

| Decision | Detail | Date |
|----------|--------|------|
| **No dark/tech aesthetic** | Christopher rejected the dark purple/pink gradient theme ("crypto bro taco bell themed"). | 2026-04-05 |
| **Wedding-appropriate design** | Research shows wedding apps use: warm light backgrounds, soft serif/sans-serif typography, muted earth tones (sage, cream, blush, warm whites), editorial feel with whitespace. Competitors: Joy, Zola, Airbum, Fotify all use light, warm, clean aesthetics. | 2026-04-05 |
| **New palette (v1)** | Light/warm: cream backgrounds, sage green + warm rose accents, Georgia serif. | 2026-04-05 |
| **Palette refinement (v2)** | Champagne + pastels. Target the bride/femme — she's the decision maker. Drop Georgia (too basic), use elevated typography (Cormorant Garamond headings, DM Sans body). Champagne gold primary accent, soft blush, dusty rose, warm cream. Aspirational, editorial, feminine without being "girly." | 2026-04-05 |

## Technical Decisions

| Decision | Detail | Date |
|----------|--------|------|
| **React SPA (Vite)** | React + Vite, no build complexity. Clean component architecture ready for backend later. | 2026-04-05 |
| **Client-side storage** | Using localForage (IndexedDB) for now. Storage service layer abstracted so backend can be swapped in. | 2026-04-05 |
| **EXIF stripping** | Core privacy feature. Canvas-based re-encoding removes all metadata (GPS, camera, timestamps). | 2026-04-05 |
| **AES-256-GCM encryption** | Password-based album protection using Web Crypto API. | 2026-04-05 |
| **QR code sharing** | Guests access albums via QR code → share URL with short code. | 2026-04-05 |
| **Supabase backend** | Postgres + Storage + Auth + Realtime. Single service covers DB, file storage, auth, and live subscriptions for slideshow. Schema in `supabase/migrations/001_initial_schema.sql`. | 2026-04-05 |
| **Dual-mode storage** | Storage service auto-detects Supabase config. Falls back to localForage when env vars aren't set. Same API for all consumers. | 2026-04-05 |
| **Auth: email + magic link** | Supabase Auth with email/password and passwordless magic link. Auth context wraps the app. Mock auth for local dev. | 2026-04-05 |
| **Deployment: Vercel** | Vite build → Vercel with SPA rewrites. Env vars for Supabase connection. | 2026-04-05 |
| **Web-first, no native app** | Ship as a web app, not iOS/Android. "No app download" is a selling point. PWA wrapper possible later. Avoids 30% app store tax on $99 price. | 2026-04-05 |
| **TV display via smart TV browser** | No laptop needed. Couple opens `/tv/:albumId` on smart TV browser, Fire Stick, or casts from phone. Real-time photo updates, auto-fullscreen, QR overlay for guests. | 2026-04-05 |
| **Realtime via Supabase** | Photos and messages tables publish to `supabase_realtime`. Slideshow and TV display subscribe for live updates instead of polling. | 2026-04-05 |

## Features Built (v0)

- Dashboard with album grid
- Create album (name, description, optional password)
- Album detail view with photo gallery
- Drag-and-drop photo upload with EXIF stripping
- Lightbox photo viewer with keyboard navigation + swipe
- QR code generation for sharing (view+upload and upload-only URLs)
- Guest upload page (standalone, no app chrome, camera support)
- Guest gallery view (read-only, standalone)
- Password protection on albums
- Bulk download as ZIP (JSZip)
- Cover photo selection
- Delete photo with confirmation modal
- Toast notification system

## Features Built (v1 — April 2026)

- **Table sign generator** (`/album/:id/signs`) — customizable QR code table signs with 6 color presets, custom color pickers, couple names, wedding date, heading/subtext editing. Full-page (8.5×11") or quarter-page (4×, for tabletop acrylic signs). Uses `window.print()` for print/save-as-PDF. Link from AlbumView QR section.
- **Landing page rebuild** — replaced dark Private Party landing page with champagne/pastel aesthetic matching the app. Cormorant Garamond + DM Sans typography. Sections: hero, how-it-works, features, social proof (privacy-focused stats), pricing, waitlist. Fade-in scroll animations.
- **Photo lightbox bug fix** — hover overlay was intercepting click events on photo grid, preventing lightbox from opening. Fixed with `pointer-events: none` on overlay + CSS hover visibility + `pointer-events: auto` on action buttons.

## Features Built (v2 — April 2026)

- **Reception slideshow** (`/album/:id/slideshow`) — full-screen auto-advancing photo slideshow for reception displays. Features: configurable intervals (3/5/8/12s), three transition effects (fade/slide/zoom), fullscreen mode, keyboard controls (arrows, space, P for pause, F for fullscreen), auto-hiding controls, progress dots for ≤30 photos. Polls for new photos every 10 seconds with "New photos added!" badge — photos appear in real time as guests upload.
- **Photo moderation** — toggle per album (`moderationEnabled` flag). When enabled, guest uploads get `status: 'pending'` instead of `'approved'`. Inline approve/reject buttons (green checkmark / red X) visible on pending photos. "Approve All" bulk action. Pending and rejected photos hidden from shared guest gallery and slideshow. Filter tabs: All / Pending / Favorites.
- **Favorites** — heart button on every photo (always visible, top-right corner). Toggling fills/unfills the heart. Favorites filter tab in photo grid. Favorite state persists on photo object (`favorite: true/false`).
- **Guest book messages** — optional name + message field appears on Upload page after photos are selected. Messages saved to new `messageStore` in localForage. Guest Book section in AlbumView shows messages with attribution and date. Expandable (shows 3 by default, "Show all" for more). Couple can delete individual messages.

## Upcoming Features

| Feature | Detail | Priority |
|---------|--------|----------|
| **Thank you card generator** | Generate printable thank-you cards using uploaded photos. | Medium |
| **Export to cloud** | Export album to Google Photos, iCloud, Dropbox. | Low |
| **Timeline view** | Photos organized by time of day (ceremony, cocktails, reception, etc.). | Low |
| **Music integration for slideshow** | Background music during reception slideshow. | Low |
| **Sub-albums / curation** | Create curated collections from favorites (e.g., "Best of Reception"). | Low |

## Product Direction

| Decision | Detail | Date |
|----------|--------|------|
| **Stay focused on photos** | Rejected expanding into "all-in-one wedding app" (color palette, seating charts, etc.). First Look's strength is focus: private photo sharing, done well. Color palette tools etc. could be a free lead-gen tool later, but not in the core product. | 2026-04-05 |
| **Landing page integrated into React app** | Moved landing page from standalone HTML into a React component (`LandingPage.jsx`). `/` shows landing page, `/dashboard` shows authenticated app. One Vercel project deploys everything. | 2026-04-05 |

## Open Questions

- [x] Product name — **First Look** (firstlook.love)
- [x] Backend strategy — Supabase (Postgres + Storage + Auth + Realtime). Schema built, storage service refactored.
- [x] Domain name — firstlook.love (purchased via Namecheap, 2026-04-05)
- [x] Email: hello@firstlook.love — Namecheap Private Email (Starter, 1yr prepaid). Auto-forward to info@cweird.com. Webmail at privateemail.com for replies.
- [x] DNS configured: A record @ → 76.76.21.21, CNAME www → cname.vercel-dns.com, MX records for Private Email
- [ ] Stripe integration for $99 payment
- [ ] Photo compression/optimization on upload (resize for web, keep original in storage)
- [ ] Email notifications (new photo uploaded, magic link, welcome)
- [ ] GDPR compliance — guest data deletion flow
- [ ] Load testing — 150 concurrent uploads during toast
- [ ] Storage cost modeling — $0.021/GB on Supabase, ~6GB per wedding = ~$0.13/wedding
- [ ] Music for slideshow — Spotify embed? Upload MP3? Licensing?
- [ ] Thank you cards — layout options? Include guest name?

## Features Built (v3 — April 2026)

- **Stripe checkout page** (`/checkout`) — $99 one-time payment flow. When Stripe keys are configured (VITE_STRIPE_PUBLISHABLE_KEY), redirects to Stripe Checkout. Before that, captures pre-order intent and adds to waitlist. Supports Stripe Payment Links and Supabase Edge Functions for session creation.
- **Checkout success page** (`/checkout/success`) — confirms payment or waitlist signup. Two modes: "waitlist" (pre-launch) and "paid" (post-launch with account creation CTA).
- **Admin dashboard** (`/admin`) — password-protected admin panel showing waitlist signups with stats (total, today, this week), CSV export, and table view. Default password: `firstlook2026` (configurable via VITE_ADMIN_PASSWORD).
- **Fade-in CSS fallback** — added CSS @keyframes fallback so sections become visible after 2s even if IntersectionObserver fails. Also added `prefers-reduced-motion` support.
- **Pricing CTA → checkout** — pricing section "Get Early Access" button now routes to /checkout instead of scrolling to waitlist.

## Deployment Checklist

- [x] Create Supabase project (wutegwjlutfubyjrzqgb, East US)
- [x] Run migration (`001_initial_schema.sql`)
- [x] Create storage buckets (`photos`, `thumbnails`) with public access + RLS policies
- [x] Set up Vercel project, connect to GitHub (cweirdart/firstlook)
- [x] Add env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) in Vercel
- [x] Configure firstlook.love DNS → Vercel (A record @ → 76.76.21.21, CNAME www → cname.vercel-dns.com)
- [x] SSL/HTTPS (automatic with Vercel — generating certificates)
- [x] Test waitlist API end-to-end (POST returns 201, data saved)
- [ ] Set up Stripe account + add VITE_STRIPE_PUBLISHABLE_KEY and VITE_STRIPE_PAYMENT_LINK env vars
- [ ] Set up VITE_ADMIN_PASSWORD env var in Vercel (production admin password)
- [ ] Test full flow: signup → create album → print QR → guest upload → view photos → slideshow
- [ ] Verify email forwarding (hello@firstlook.love → info@cweird.com)

## Rejected Approaches

| What | Why rejected | Date |
|------|-------------|------|
| Dark theme with purple/pink gradients | Wrong for wedding audience. Looks like crypto/AI, not wedding. | 2026-04-05 |
| Full-stack from day one | Premature. Better to nail the frontend UX first, then add backend. | 2026-04-05 |
| Private Party branding | This is a separate product. | 2026-04-05 |
| Native iOS/Android app | Web-first is the right call. "No app download" is a feature, not a limitation. Guests never download anything. Avoids 30% app store tax. PWA possible later. | 2026-04-05 |
| Laptop for TV display | Couples shouldn't need extra hardware. Smart TV browser + short URL solves it. Fire Stick as $30 fallback. | 2026-04-05 |
