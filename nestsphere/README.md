# NestSphere

Static site: `index.html` (public home), `login.html`, `register.html`, and `js/dashboard/index.html` (authenticated dashboard).

## Run (Antigravity / any editor)
- Serve over HTTP (do not open the HTML files directly): use Live Server, or run `npm start` from this folder and open http://localhost:3000.
- Login and registration call the API at `http://localhost:5000` by default. Run the NestSphere backend separately and set `window.NESTSPHERE_API_URL` in the page before `js/auth-config.js` if the API uses a different URL.
- Successful login redirects to `js/dashboard/`; the dashboard checks the backend session and returns unauthenticated visitors to login.
- The backend is in the `nestsphere (9)` project folder; configure its MongoDB connection there and start it with `node server.js` from its `js/` folder.

## Structure
- css/styles.css       shared styles
- js/tailwind-config.js shared Tailwind theme (colors, fonts)
- js/layout.js         shared header + footer (login/register pages)
- js/login.js, js/register.js  form logic
Needs internet for Tailwind CDN, Google Fonts and images.
