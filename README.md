# ShiftIndia — Packers & Movers Marketplace

A modern Next.js 14 + Prisma + MySQL platform connecting customers with verified packers & movers across India.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with custom saffron/midnight design system
- **Prisma ORM** + **MySQL** (XAMPP)
- **lucide-react** icons

## Project Structure

```
app/
  page.tsx              # Homepage (hero search)
  quotes/page.tsx       # Compare quotes
  booking/page.tsx      # 5-step booking flow
  tracking/page.tsx     # Live tracking
  dashboard/page.tsx    # Customer dashboard
  vendor/page.tsx       # Vendor dashboard
  admin/
    page.tsx            # Admin home (mock data for now)
    inquiries/
      page.tsx          # 🟢 Real inquiries from DB
      [id]/page.tsx     # Inquiry detail + send quote
  cities/[slug]/page.tsx # Static city landing pages (DB-driven, SEO-ready)
  api/
    inquiries/          # POST/GET inquiries
    inquiries/[id]/     # GET/PATCH/DELETE one inquiry
    quotes/             # POST/GET quotes
    quotes/[id]/        # PATCH/DELETE quote
    cities/             # GET cities
components/
  HeroSearchForm.tsx    # Client form → POSTs to /api/inquiries
  StickySearch.tsx      # Floating compact search
  Navbar.tsx, Footer.tsx
  StatusBadge.tsx
  admin/
    QuoteForm.tsx
    StatusUpdater.tsx
prisma/
  schema.prisma         # Database models
  seed.ts               # Seed cities + sample inquiries
lib/
  prisma.ts             # Singleton Prisma client
.env.local              # DATABASE_URL etc.
```

## Setup

### 1. Start MySQL (XAMPP)
- Open XAMPP Control Panel
- Start **Apache** + **MySQL**
- Open phpMyAdmin → confirm database `packers` exists (already created)

### 2. Install dependencies
```bash
npm install
```
This auto-runs `prisma generate` (postinstall hook).

### 3. Configure database connection
Edit `.env.local` if your MySQL credentials differ from defaults:
```env
DATABASE_URL="mysql://root:@localhost:3306/packers"
```
- `root` = MySQL user
- empty after `:` = no password (XAMPP default)
- `packers` = database name

### 4. Push schema to MySQL
```bash
npm run db:push
```
This creates all tables (cities, routes, inquiries, quotes) in your `packers` database.

### 5. Seed sample data
```bash
npm run db:seed
```
Inserts 8 cities (Ahmedabad, Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata) and 2 sample inquiries.

### 6. Run dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run db:push` | Sync Prisma schema → MySQL (no migrations) |
| `npm run db:migrate` | Create a migration file (for production) |
| `npm run db:seed` | Run `prisma/seed.ts` |
| `npm run db:reset` | ⚠️ Drops all tables, recreates, re-seeds |
| `npm run db:studio` | Open Prisma Studio GUI on port 5555 |

## How the inquiry flow works

1. **Customer** fills the hero search form on `/`
2. `HeroSearchForm.tsx` (client) POSTs to `/api/inquiries`
3. API route uses Prisma to insert into `inquiries` table
4. Customer is redirected to `/quotes?id=<inquiry_id>`
5. **Admin** opens `/admin/inquiries` → sees the new inquiry in real time
6. Admin clicks **Open** → goes to `/admin/inquiries/[id]`
7. Admin can:
   - Change status (new → contacted → quoted → booked)
   - Add a quote (vendor name, price range, ETA, notes)
   - Save as draft or **Send to customer** (auto-marks inquiry as `quoted`)

## SEO city pages

`/cities/[slug]` — fully static (built at build time) but content fetched from MySQL.

Examples:
- `/cities/ahmedabad`
- `/cities/mumbai`
- `/cities/delhi`

Each page has:
- Custom meta title/description from DB
- Hero with city stats
- Intro + Why Us content blocks
- Popular routes (clickable to other city pages)
- FAQ accordion
- Schema.org JSON-LD for rich snippets

To add a new city, just insert a row in the `cities` table (or via Prisma Studio) and rebuild — no code changes needed.

## Routes

| Public | |
|---|---|
| `/` | Homepage |
| `/quotes` | Compare vendor quotes |
| `/booking` | 5-step booking flow |
| `/tracking` | Live order tracking |
| `/dashboard` | Customer dashboard |
| `/vendor` | Vendor dashboard |
| `/cities/[slug]` | SEO city pages |

| Admin | |
|---|---|
| `/admin` | Overview |
| `/admin/inquiries` | All inquiries (DB) |
| `/admin/inquiries/[id]` | Inquiry detail + add quote |

| API | |
|---|---|
| `POST /api/inquiries` | Create inquiry |
| `GET /api/inquiries?status=new` | List inquiries |
| `GET /api/inquiries/:id` | One inquiry |
| `PATCH /api/inquiries/:id` | Update status |
| `DELETE /api/inquiries/:id` | Delete |
| `POST /api/quotes` | Create quote (`send: true` to mark as sent) |
| `GET /api/quotes?inquiryId=1` | List quotes |
| `PATCH /api/quotes/:id` | Update status |
| `GET /api/cities` | List active cities |

## Next steps

- [ ] Auth (NextAuth) for admin + customer login
- [ ] Razorpay integration for payments
- [ ] Vendor onboarding + KYC upload
- [ ] Email/SMS notifications when quote is sent
- [ ] Routes table — `/routes/ahmedabad-to-mumbai` SEO pages
- [ ] Google Maps API for live tracking
- [ ] AI vendor matching engine

---

Built with ♥ in Bharat.
