# TAJDEED MVP (Solo-Founder Edition)

A lean web app (PWA) that tracks UAE life-admin expiry dates (Emirates ID, car registration, driver's license, visa, insurance, tenancy, trade license, passport) and auto-sends reminders by email (and optionally WhatsApp). Built for deployment on Vercel + Supabase + Resend.

## 1) What You Get
- Auth via Supabase magic link (email)
- Dashboard to add documents/items with expiry dates
- Arabic/English UI toggle
- Daily reminder cron (Vercel) emails users X days before expiry
- Static renewal guides per category
- Optional WhatsApp reminder sender (Meta Cloud API)
- Clean dark UI, mobile-first

## 2) Deploy (15–30 min)
**A. Supabase**
1. Create a Supabase project → copy URL + anon key + service role key.
2. Run the SQL in `supabase/migration.sql` (Table Editor → New query).
3. Enable Email auth (disable phone for now).

**B. Resend (Email)**
1. Create a Resend account → get API key.
2. Add a domain + set DNS (or use a default sandbox sender initially).

**C. Vercel**
1. Import this repo.
2. Add Environment Variables from `.env.example`.
3. Set up a Cron Job: Project → Settings → Cron Jobs →
   - Path: `/api/cron/due-notifications`
   - Schedule: `0 6 * * *` (runs daily 10 AM UAE if project is UTC+0; adjust as needed)

**D. (Optional) WhatsApp Cloud API**
1. Create a Meta app → WhatsApp → add a phone number.
2. Put `META_WHATSAPP_TOKEN` and `META_PHONE_NUMBER_ID` in Vercel env.
3. Create a template named `tajdeed_reminder`.

## 3) Local Dev
```
cp .env.example .env.local
npm i
npm run dev
```

## 4) How Reminders Work
- For each item, the system computes reminder dates based on defaults for the category or the user's custom days (e.g., 60/30/7/1 days before expiry).
- The daily cron checks which items should send today and sends email (and WhatsApp if configured).
- A log is written to `reminder_logs` so we never double-send for the same day.

## 5) Database
See `supabase/migration.sql`. Key tables:
- `profiles` (user profile & language)
- `items` (tracked document with expiry_date and optional file_url)
- `reminder_logs` (what was sent, when, channel)

## 6) Notes
- This is a web app you can install on your phone (PWA). To ship to App Store later, wrap it with Capacitor.
- Security: All user data stays in Supabase; RLS rules ensure each user sees their own data.

Good luck!
