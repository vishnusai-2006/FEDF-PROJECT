Deploying the frontend as a static site (recommended)
===============================================

Why this helps
--------------
- Static hosts (Netlify, Render Static, Vercel) serve built files instantly without a server process to wake. That eliminates cold-start/loading delays when users open the site.

Two easy options
----------------

1) Netlify (quick, free tier)

- Steps (quick deploy):
  1. Build locally (optional):
     ```powershell
     cd frontend
     npm install
     npm run build
     ```
  2. Create a new site on Netlify and connect to this GitHub repo, or drag-and-drop the `frontend/dist` folder in the Netlify UI (Sites → New site → Drag & drop).
  3. If using the Git integration, set these site settings:
     - Build command: `npm install && npm run build`
     - Publish directory: `frontend/dist`
  4. Set an environment variable in Netlify (Site settings → Build & deploy → Environment):
     - `VITE_API_BASE_URL` = `https://fedf-project-xr4z.onrender.com` (or your API URL)
  5. Deploy. The Netlify URL will open instantly.

2) Render Static (if you prefer to keep everything on Render)

- Steps:
  1. In the Render dashboard click New → Static Site → Connect repo.
  2. Fill in:
     - Build Command: `npm install && npm run build`
     - Publish Directory: `frontend/dist`
  3. Add an environment variable in the Render static site settings:
     - `VITE_API_BASE_URL` = `https://fedf-project-xr4z.onrender.com`
  4. Create the site. When the static site is built, it will serve instantly.

Longer term
-----------
- For production, prefer separate static hosting for the frontend and a dedicated backend service for the API. This is more resilient, faster for users, and cheaper than paying to keep a server "always on".

If you want, I can:
- Add a `netlify.toml` (already added) and help connect Netlify.
- Prepare a short `render.yaml` if you prefer to create a Render Static site programmatically.
