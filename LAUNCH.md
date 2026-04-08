# First Look — Launch Checklist

Step-by-step guide to go from code to live at firstlook.love.

---

## 1. Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Name: `firstlook` (or whatever you like)
4. Set a strong database password (save it somewhere secure)
5. Region: pick the closest to your users (e.g., US East)
6. Wait for the project to provision (~2 minutes)

### Get your API keys

1. Go to **Settings → API**
2. Copy the **Project URL** (looks like `https://abc123.supabase.co`)
3. Copy the **anon/public** key (starts with `eyJ...`)
4. Save both — you'll need them for Vercel env vars

### Run the database migration

1. Go to **SQL Editor** in the Supabase dashboard
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run** — this creates all tables, RLS policies, and triggers
4. Then paste and run `supabase/migrations/002_waitlist.sql`

### Create storage buckets

1. Go to **Storage** in the sidebar
2. Create a bucket called `photos`
   - Public bucket: **Yes** (guests need to view photos)
3. Create a bucket called `thumbnails`
   - Public bucket: **Yes**
4. For each bucket, go to **Policies** and add:
   - **INSERT**: Allow all (so guests can upload)
   - **SELECT**: Allow all (so photos are viewable)
   - **DELETE**: Allow if `auth.uid()` matches album owner (use a custom policy)

### Enable Realtime

1. Go to **Database → Replication**
2. Under "Supabase Realtime", enable the `photos` and `messages` tables
   (The migration already added them to the publication, but double-check here)

---

## 2. Deploy to Vercel

1. Push the `app/` directory to a GitHub repo (or the whole repo with root directory set to `app`)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Set the **Root Directory** to `app`
5. Framework: **Vite** (should auto-detect)
6. Build command: `npm run build`
7. Output directory: `dist`

### Add Environment Variables

In Vercel project settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### Add Custom Domain

1. Go to **Settings → Domains**
2. Add `firstlook.love`
3. Vercel will show you DNS records — these should already be configured:
   - A record `@` → `76.76.21.21` ✓ (already done)
   - CNAME `www` → `cname.vercel-dns.com` ✓ (already done)
4. SSL certificate will be auto-provisioned

---

## 3. Update Waitlist Form

Once Supabase is live, update the landing page's waitlist integration:

1. Open `app/src/pages/LandingPage.jsx`
2. The waitlist form already imports the Supabase client
3. It will automatically use Supabase when env vars are configured
4. Test by submitting an email and checking the `waitlist` table in Supabase

---

## 4. Set Up Stripe (for $99 payment)

This is the remaining piece before you can accept real customers.

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create a Product called "First Look — Wedding Package" at $99 one-time
3. Get your publishable key and add it as `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel
4. Create a Checkout Session endpoint (Supabase Edge Function or separate API)
5. Wire the "Get Started" button on the landing page to Stripe Checkout

---

## 5. Test the Full Flow

- [ ] Visit firstlook.love — landing page loads
- [ ] Sign up for a new account
- [ ] Create an album
- [ ] Generate and print a QR code table sign
- [ ] Scan QR code from phone → upload a photo as a guest
- [ ] View the photo in the album
- [ ] Open slideshow on a second device/TV
- [ ] Upload another photo → confirm it appears in the slideshow live
- [ ] Leave a guest book message
- [ ] Download photos as ZIP
- [ ] Test password protection
- [ ] Test photo moderation
- [ ] Submit a waitlist email
- [ ] Verify forwarding: send test email to hello@firstlook.love → check info@cweird.com

---

## Infrastructure Summary

| Service | Purpose | Cost |
|---------|---------|------|
| **Supabase** (Free tier) | Database, Auth, Storage, Realtime | $0/mo (up to 500MB DB, 1GB storage) |
| **Vercel** (Hobby) | Hosting, CDN, SSL | $0/mo |
| **Namecheap** | Domain (firstlook.love) | ~$30/yr |
| **Namecheap Private Email** | hello@firstlook.love | ~$9/yr |
| **Stripe** | Payments | 2.9% + $0.30 per transaction |

**Total monthly cost at launch: ~$0** (until you exceed free tiers)

Supabase Pro ($25/mo) is needed once you hit: 500MB database, 1GB file storage, or 50,000 monthly active users.
