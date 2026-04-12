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
| **Video messages from guests** | Guests record 30-60s video messages for the couple via browser MediaRecorder API. Premium upsell feature ($29-49 add-on or bundled in higher tier). Supabase Storage for video files, cap file size to control costs. Natural extension of guest book. | High |
| **Merch / print-on-demand** | Dropshipping integration for t-shirts, mugs, party favors, souvenirs. Target audience: best man/bridesmaids planning showers, bachelorette/bachelor parties. Will integrate with the apparel mockup app Christopher is building separately. Cross-product synergy between First Look and the mockup tool. | High |
| **Thank you card generator** | Generate printable thank-you cards using uploaded photos. | Medium |
| **Export to cloud** | Export album to Google Photos, iCloud, Dropbox. | Low |
| **Timeline view** | Photos organized by time of day (ceremony, cocktails, reception, etc.). | Low |
| **Music integration for slideshow** | Background music during reception slideshow. | Low |
| **Sub-albums / curation** | Create curated collections from favorites (e.g., "Best of Reception"). | Low |

## Product Direction

| Decision | Detail | Date |
|----------|--------|------|
| **All-in-one wedding platform** | Reversed earlier "stay focused on photos" decision. New strategy: photo QR sharing is the unique hook, then upsell planning tools (color palettes, RSVP, seating), merch/dropshipping, and services. "I might as well just pay for it all from First Look." Free tools (like color palette generator) double as SEO/lead gen. | 2026-04-12 |
| **Landing page integrated into React app** | Moved landing page from standalone HTML into a React component (`LandingPage.jsx`). `/` shows landing page, `/dashboard` shows authenticated app. One Vercel project deploys everything. | 2026-04-05 |
| **Use existing Stripe account** | No need for a separate Stripe account. Create a Product + $99 Price under existing account. Separate accounts only needed if First Look becomes its own legal entity. | 2026-04-09 |
| **Video messages = premium upsell** | Guest video messages (30-60s, browser-recorded) planned as first premium feature. Upsell via add-on or higher pricing tier. Builds on existing guest book UX. Ship core product first, add video post-launch. | 2026-04-09 |
| **Merch/print-on-demand = future integration** | T-shirts, mugs, party favors via dropshipping. Targets bridal party planners (best man, bridesmaids). Will connect to Christopher's separate apparel mockup app when ready. Not in v1 — ship core photo product first, add merch as a revenue expansion. | 2026-04-09 |

## Features Built (v4 — April 2026)

- **Video messages feature** — full end-to-end: VideoRecorder component (MediaRecorder API, 60s max, 50MB limit, WebM/MP4), storage service functions (save/get/delete), Supabase migration (`003_video_messages.sql`), Upload page integration (record button, upload progress), AlbumView playback component (video player, guest attribution, delete, show-all expansion).
- **Realtime subscriptions** — replaced 8-10s polling in Slideshow and TVDisplay with Supabase realtime subscriptions (`subscribeToPhotos`). Photos now appear instantly on display screens when guests upload.
- **Dashboard quick actions** — Share (copy guest upload link), Slideshow, TV, and Setup Guide buttons on each album card. No more navigating into albums for common actions.
- **Guest count stat** — AlbumView stats bar now shows unique guest count derived from photo `guestName` field.
- **Filter by guest** — dropdown in AlbumView to filter photo grid by individual guest name.
- **Slideshow keyboard help** — press `?` to see all keyboard shortcuts in a styled overlay (Space/arrows, P for pause, F for fullscreen, Esc to close).
- **Wedding Day Setup Guide** (`/album/:id/setup`) — step-by-step guide designed to be texted to whoever is setting up the venue (best man, DJ, coordinator). Includes: print table signs, set up display device (with link copy buttons for TV/Slideshow), share upload link, troubleshooting FAQ. "Send to helper" button uses Web Share API or clipboard.
- **Color Palette Generator** (`/tools/colors`) — free wedding planning tool. 12 curated palettes with tag filters (classic, boho, romantic, seasonal), "Build Your Own" mode with color picker that generates harmonious 5-color palettes. Copy individual hex codes or all at once. CTA to First Look product. First of the "wedding tools" add-ons for SEO/lead gen.

## Features Built (v5 — April 2026)

- **SEO pages for every wedding role:**
  - `/for-planners` — targeting wedding planners & coordinators. First Look vs photo booth comparison, setup instructions, FAQ, JSON-LD FAQPage schema.
  - `/for-wedding-party` — targeting best man, maid of honor, bridesmaids, groomsmen. Role-specific tips, step-by-step setup, troubleshooting, FAQ, JSON-LD schema.
  - `/for-photographers` — targeting photographers who can recommend or bundle First Look. Professional vs guest photo comparison, package add-on positioning, FAQ, JSON-LD schema.
  - `/for-djs` — targeting wedding DJs & MCs. Photo booth replacement pitch, DJ package upsell pricing ($99 cost → $150-250 markup), AV integration, FAQ, JSON-LD schema.
- **Cross-linking between all SEO pages** — HowItWorks and ForPlanners pages now link to all role-specific pages, creating an internal link network for SEO.
- **Enriched structured data** — index.html now has WebSite schema, Organization schema, WebPage schema with BreadcrumbList pointing to all content pages.
- **Landing page footer updated** — Resources section now links to all 7 content/tool pages.
- **Sitemap expanded** — all new pages added with appropriate priority weights.

## Features Built (v6 — April 2026)

- **llms.txt** — Plain-text file at `/llms.txt` describing First Look for AI crawlers (ChatGPT, Perplexity, Claude). Includes full product description, feature list, comparison table, pricing, audience breakdown, and links to all content pages.
- **robots.txt** — Explicitly allows GPTBot, ChatGPT-User, Claude-Web, Anthropic-AI, PerplexityBot, and Google-Extended. Blocks authenticated routes (dashboard, album, admin).
- **Couple-type customization** — Album creation now includes a couple-type selector: Bride & Groom, Groom & Bride, Bride & Bride, Groom & Groom, or Custom. Stored on the album as `couple_type`. Used by `coupleType.js` utility to derive role labels (best man, maid of honor, etc.) throughout the app. SetupGuide and AlbumView both use it. Migration: `004_couple_type.sql`.

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
