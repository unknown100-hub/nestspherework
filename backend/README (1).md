# NestSphere Dashboard

Client dashboard for the NestSphere proptech portal. Plain HTML + CSS + JavaScript (Tailwind via CDN) – no build step.

## How to run
Open `index.html` in a browser. (Needs internet for Tailwind, fonts and icons.)
Optional local server: `npx serve .`

## Folder map

```
nestsphere/
├── index.html                  Page layout: sidebar, header, empty tab containers, modal, <script> list
├── css/
│   └── styles.css              Custom styles (scrollbar, spinner, glow)
├── js/
│   ├── config/
│   │   ├── tailwind.config.js  Brand colours and fonts
│   │   └── constants.js        Fixed data: listings, studios, packages, engineers, banks, images
│   ├── utils/
│   │   ├── helpers.js          fmt (money), esc (safe HTML), dates, ids, $ and val shortcuts
│   │   └── validators.js       Card (Luhn/brand/expiry) and password checks
│   ├── core/
│   │   ├── store.js            App state + save/load (browser storage for now)
│   │   └── auth.js             Client vs administrator permissions
│   ├── services/
│   │   ├── wallet.js           Balance, totals, record a transaction
│   │   └── gateway.js          Payment gateway (SIMULATED – replace with real API calls)
│   ├── ui/
│   │   ├── modal.js            Pop-up window
│   │   └── checkout.js         The one payment checkout (Wallet, M-Pesa, Bank, Visa, Mastercard)
│   ├── views/                  WHAT YOU SEE – builds the HTML, one file per tab
│   │   ├── shared.js           Views object + banner / card / empty pieces
│   │   ├── dashboard.js        Dashboard tab
│   │   ├── real-estate.js      Real Estate tab
│   │   ├── interior-design.js  Interior Design tab
│   │   ├── properties.js       Properties tab
│   │   ├── construction.js     Construction tab (engineers + escrow)
│   │   ├── profile.js          Profile tab
│   │   └── settings.js         Settings tab
│   ├── app/                    WHAT HAPPENS WHEN YOU CLICK – one file per feature
│   │   ├── app.js              Start-up, tab switching, search, notifications, toast
│   │   ├── wallet.js           Top-up, history filter, CSV export
│   │   ├── real-estate.js      Filters, save, reserve/rent, installments
│   │   ├── bookings.js         Site visit / consultation / inspection booking
│   │   ├── interior-design.js  Design package deposit and balance
│   │   ├── construction.js     Fund and release escrow milestones
│   │   ├── profile.js          Save profile, upload picture
│   │   └── settings.js         Password, security, notifications, payment prefs, data
│   └── main.js                 Starts the app
└── docs/
    └── ARCHITECTURE.md         Client vs admin features, API list, recommended backend
```

## How the pieces connect

```
 click  ──►  app/*.js (action)  ──►  Store (changes data)
                │                       │
                ├─► ui/checkout.js ─► services/gateway.js ─► services/wallet.js
                │
                └─► views/*.js (redraw the tab with the new data)
```

1. A **view** draws a tab from the data in the Store.
2. A button in that view calls an **action** in `js/app/`.
3. The action changes the Store (and for payments goes through the checkout and wallet).
4. `App.refreshAll()` redraws the views, so balances and lists update instantly.

## "I want to change…" quick guide

| I want to… | Edit this file |
|---|---|
| Add or edit a property listing | `js/config/constants.js` → `LISTINGS` |
| Change design packages, studios, engineers | `js/config/constants.js` |
| Change colours or fonts | `js/config/tailwind.config.js` |
| Change how a tab looks | `js/views/<tab>.js` |
| Change what a button does | `js/app/<feature>.js` |
| Add a payment method | `js/ui/checkout.js` (`METHODS`, `collect`) and `js/services/gateway.js` |
| Connect real M-Pesa / card / bank | `js/services/gateway.js` (call your server) |
| Change wallet rules | `js/services/wallet.js` |
| Add a role or permission | `js/core/auth.js` |
| Move data to a database | `js/core/store.js` (`load` / `save`) |

## Important: script order
The files are plain scripts (not modules) so the page also works when opened directly from disk.
They must stay in the order listed at the bottom of `index.html`: config → utils → core → services → ui → views → app → main.

## Before going live
- `gateway.js` is a simulation. Real payments need a backend (Node/Express) calling Safaricom Daraja, a card provider and your bank, with webhooks confirming each payment.
- Data is stored in the browser only. Move it to a server database (MongoDB) with real login.
- Demo password for Settings → Change Password: `Demo@12345`.
- The UI hides admin actions, but only the server can truly enforce permissions.

See `docs/ARCHITECTURE.md` for the full client/administrator breakdown and API plan.
