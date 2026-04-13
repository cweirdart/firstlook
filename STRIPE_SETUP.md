# Stripe Setup for First Look

One-time setup to accept $99 wedding album payments through Stripe Checkout.
This is a developer-facing reference — run through it once when going live.

## 1. Create the Stripe account

1. Sign up at https://dashboard.stripe.com/register with `hello@firstlook.love`.
2. Activate live mode once business details are in. Test mode is fine for the pre-launch dev cycle.
3. Turn on two-factor auth on the Stripe login.

## 2. Create the product + price

Dashboard: **Product catalog → Add product**

- Name: `First Look Wedding Album`
- Description: `One-time purchase. Unlimited guest uploads, live reception slideshow, lifetime album access.`
- Pricing model: **One-time**
- Price: `$99.00 USD`
- Tax behavior: **Inclusive** (we're absorbing tax for this launch)

After saving, grab the `price_…` ID — this is what the checkout flow references.

## 3. Environment variables (Vercel)

Set these in **Vercel → Project → Settings → Environment Variables** (for Production + Preview + Development):

| Variable | Value | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_…` | Server side, used by the checkout API route |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_…` | Exposed as `VITE_STRIPE_PUBLISHABLE_KEY` on the client |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_…` | Mirror — Vite needs the `VITE_` prefix to expose |
| `STRIPE_WEDDING_PRICE_ID` | `price_…` | From step 2 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | From step 5 |

For the pre-launch dev phase, use test-mode keys (`sk_test_…`, `pk_test_…`) and a test price. Switch to live before announcing.

## 4. Checkout flow summary

The client:

1. User clicks **Get Early Access** on `/` or **Create Album** in the app.
2. We POST to `/api/checkout` with `{ albumId?, email }`.
3. Server creates a Stripe Checkout Session in `mode: 'payment'` with `success_url=/checkout/success?session_id={CHECKOUT_SESSION_ID}` and `cancel_url=/checkout`.
4. User pays on Stripe-hosted checkout.
5. Stripe redirects to `/checkout/success` — we fetch the session, mark the album as paid, and send a receipt.

## 5. Webhook endpoint

Dashboard: **Developers → Webhooks → Add endpoint**

- URL: `https://firstlook.love/api/stripe-webhook`
- Events to send:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
  - `charge.refunded`

Copy the signing secret (`whsec_…`) into `STRIPE_WEBHOOK_SECRET`.

The webhook handler should:
- Verify the signature with `stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)`
- On `checkout.session.completed`, find the album by `client_reference_id` (we pass `albumId` here) and flip `paid_at` on the row.
- On `charge.refunded`, unflip `paid_at` and email the couple.

## 6. Local testing

```
# Install CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward live events to local dev
stripe listen --forward-to localhost:5173/api/stripe-webhook

# Trigger a test payment
stripe trigger checkout.session.completed
```

The `stripe listen` output gives a temporary `whsec_…` for local dev.

## 7. Pre-launch checklist

- [ ] Live keys set in Vercel production
- [ ] Live price ID set in `STRIPE_WEDDING_PRICE_ID`
- [ ] Webhook endpoint registered + secret set
- [ ] Refund policy published on `/terms`
- [ ] Receipt email enabled in Stripe (Settings → Customer emails)
- [ ] Test end-to-end with a real card, then refund yourself
- [ ] Statement descriptor set to `FIRST LOOK WEDDING`
- [ ] Radar fraud rules reviewed (default rules are fine for this volume)

## 8. Future payment additions

Once the core wedding album flow is stable, the same Stripe account can add:

- `Merch add-on` prices for the apparel dropshipping flow
- `Photographer referral` subscription (for the photographer program)
- `Planner seats` annual plan

Keep products separate — don't bundle add-ons into the base album price. The $99 number is the hook; everything else upsells after the couple already owns an album.
