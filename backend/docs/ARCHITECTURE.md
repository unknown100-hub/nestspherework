# NestSphere – Structure, Roles & Feature Map

## 1. Distinct purpose per tab (no overlap)

| Tab | Purpose | Client features | Administrator features (separate admin app) |
|---|---|---|---|
| **Dashboard** | Account overview | Wallet balance, top-up, payments due, upcoming appointments, transaction/payment history (filter, CSV export) | Platform KPIs, revenue, reconciliation reports |
| **Real Estate** | Discovery | Buy / Rent / Commercial search, filters, save, book site visit, reserve & pay | Create/update/verify listings, title-deed verification, confirm visits |
| **Interior Design** | Design services | Studios, consultation booking, design packages, 20% deposit, balance payment, project tracker | Onboard/verify studios, manage packages & pricing |
| **Properties** | My portfolio | Reserved / purchased / rented items, installments, monthly rent, receipts, saved list | Contract status, title transfer, payment schedule overrides |
| **Construction (NCA)** | Build & inspection | Engineers/architects/QS, inspection & BOQ requests, escrow milestone funding and release approval | Verify NCA/BORAQS credentials, upload inspection reports, confirm milestones |
| **Profile** | Identity | Personal info, edit, avatar upload/remove, completeness | KYC review (ID / KRA / ArdhiSasa), account verification tier |
| **Settings** | Account management | Change password, account info, 2FA, sessions, notification prefs, payment prefs, data export, deletion request | User suspension, refunds, audit log, deletion approval |

Roles are encoded in `PERMISSIONS` inside `index.html`. The browser only hides/shows UI; **the server must enforce every permission**.

## 2. Payment & wallet flow

1. Client opens checkout (top-up, reservation, rent, design, escrow) – one shared component.
2. Methods: Wallet, Safaricom M-Pesa (STK push), Bank transfer, Visa, Mastercard.
3. Server creates the payment (amount verified server-side, idempotency key), gateway confirms via callback/webhook.
4. Only after confirmation: wallet credited/debited, transaction row written, balance returned.
5. Client UI refreshes instantly with the new balance and history.

Current build simulates the gateway (`Gateway.charge`). Replace with:
- M-Pesa: Safaricom Daraja STK Push + callback URL
- Cards: Stripe / Flutterwave / Pesapal hosted fields (card data never touches your server)
- Bank: PesaLink / virtual accounts + webhook

## 3. Recommended stack (matches your Node/Express/MongoDB skills)

- **Frontend:** React + Vite + Tailwind (components = the `Views.*` renderers; `Store` → React Query/Zustand)
- **Backend:** Node.js + Express, MongoDB (Mongoose), Redis (sessions/rate limit)
- **Auth:** JWT in httpOnly cookies, refresh tokens, argon2/bcrypt, optional TOTP/SMS 2FA
- **Security:** helmet, CORS allow-list, rate limiting, zod/joi validation, HTTPS only, audit log, double-entry ledger for the wallet, MongoDB transactions for balance updates

## 4. Registration endpoint

The Express backend exposes `POST /api/auth/register`. The registration and login frontend pages live in the companion `nestsphere (6)` project folder and submit to this API. The registration endpoint creates a client or contractor account in MongoDB using the `User` model. Send JSON:

```json
{
  "name": "Ada Example",
  "email": "ada@example.com",
  "password": "Use-A-Strong-Password1",
  "phone": "+254 700 000 000"
}
```

Name, email, and password are required; phone is optional. Passwords must be 10–128 characters and include uppercase and lowercase letters, a number, and a symbol. The backend hashes passwords with scrypt before saving, normalizes email addresses, and rejects duplicate emails with HTTP 409. A successful request returns HTTP 201 with the new user; password hashes are excluded from the response. Start the server from `js/` with `node server.js` or `npm start` and configure `MONGODB_URI` (or `MONGO_URI`) in `js/.env` or the environment. When the URI does not specify a database name, records go to the `nestsphere` database by default; override this with `MONGODB_DB_NAME`. Use the database user's password from Atlas Database Access, not the Atlas website login or the `<password>` placeholder; URL-encode reserved characters in credentials. If the machine's default DNS blocks Atlas SRV lookups, configure `MONGODB_DNS_SERVERS` as a comma-separated list of DNS server addresses; the connector defaults to Cloudflare and Google public DNS for SRV fallback. Keep `.env` out of version control.

The frontend submits credentials to `POST /api/auth/login`; a successful login creates a MongoDB-backed session. `GET /api/auth/session` checks the session and `POST /api/auth/logout` ends it. Serve the frontend over HTTP (for example, `npx serve .`) rather than opening the HTML files directly so browser cookies and API requests work correctly. The frontend uses port 5000 on the same hostname by default; deployments can set `window.NESTSPHERE_API_URL` before loading its `js/auth-config.js` to choose another API origin. Set `window.NESTSPHERE_DASHBOARD_URL` in the frontend to route successful logins to a separately hosted dashboard.

### Suggested folders
```
nestsphere/
  client/src/{pages,components,features/{wallet,payments,listings,design,construction,profile,settings},api,hooks}
  admin/src/...                # separate administrator app
  server/src/{routes,controllers,models,services/{payments,wallet,escrow},middleware/{auth,roles,validate},webhooks}
```

### Core API
```
POST /api/auth/register                     POST /auth/login | /auth/password
GET/PATCH /me                               POST /me/avatar
GET  /wallet                                POST /wallet/topup
GET  /transactions                          POST /payments/{mpesa|card|bank|wallet}
GET  /listings                              POST /bookings       POST /reservations
GET  /portfolio                             POST /portfolio/:id/payments
POST /design/projects                       GET/POST /escrow/milestones/:id/{fund|release}
GET/PATCH /settings                         POST /webhooks/{mpesa|card|bank}
```
