# CodesExperts

Company website and admin panel, rebuilt from the previous Laravel app.

| Folder    | What it is                                                                            |
| --------- | ------------------------------------------------------------------------------------- |
| `client/` | React 19 + TypeScript + Tailwind CSS 4 (Vite). Public website **and** admin panel.    |
| `server/` | Node.js + Express + TypeScript API. MongoDB data, admin login, image uploads, emails. |

Data is stored in MongoDB (database `codesexperts-react-db`, one collection per former MySQL table). Uploaded images are stored in Vercel Blob; the database keeps each image's public URL.

## Requirements

- Node.js 22.18 or newer (the server runs `.ts` files directly, with no build step)
- A MongoDB database (e.g. MongoDB Atlas). Put its connection string in `MONGODB_URI` in `server/.env`.
- A Vercel Blob store for image uploads. Put its `BLOB_READ_WRITE_TOKEN` in `server/.env`.

## Getting started

```bash
npm run setup                          # install all dependencies
cp server/.env.example server/.env     # then fill in MONGODB_URI, JWT_SECRET and BLOB_READ_WRITE_TOKEN
npm run dev                            # API on :4000, website on http://localhost:5173
```

- Website: http://localhost:5173
- Admin: http://localhost:5173/admin. Sign in with the existing admin account; passwords from Laravel still work.

## Deploying to Vercel

`vercel.json` runs `npm run vercel-build` (`scripts/vercel-build.mjs`), which writes `.vercel/output`:

- the built React app, served from Vercel's CDN;
- one Node function containing the whole Express app. It handles `/api/*`, `/sitemap.xml` and every page URL, and puts each page's SEO tags (from **Admin → Meta Tags**) into the HTML before JavaScript runs, so search engines can read them.

1. Push the repo to GitHub and import it in Vercel (leave Framework Preset as **Other** and Root Directory as the repo root; `vercel.json` sets the commands).
2. **Storage → Create → Blob**, then connect the store to the project. This adds `BLOB_READ_WRITE_TOKEN` automatically.
3. **Settings → Environment Variables**: add `MONGODB_URI`, `MONGODB_DB` and `JWT_SECRET`.
4. In MongoDB Atlas, **Network Access → allow `0.0.0.0/0`**, because Vercel functions don't have fixed IP addresses.
5. Deploy.

Optional variables: `APP_URL` (the sitemap otherwise uses the Vercel production domain) and `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `ADMIN_EMAIL` for enquiry emails, which are printed to the function log while `SMTP_HOST` is empty.

Image uploads are limited to 4 MB, because Vercel rejects request bodies over 4.5 MB.

### Moving the existing images to Blob (once)

With `BLOB_READ_WRITE_TOKEN` in `server/.env`:

```bash
npm --prefix server run migrate:blob
```

This uploads every image still referenced by a local path from `server/uploads/` and replaces the path with its Blob URL. Running it again skips rows that are already done. Afterwards `server/uploads/` is no longer used.

## Self-hosting

```bash
npm run build      # builds client/dist
npm start          # Express serves the API and the built site on PORT (default 4000)
```

Set `NODE_ENV=production` along with the variables above. Put the app behind HTTPS; admin cookies are marked `Secure` in production.

## Project structure

```
client/src/
  main.tsx, App.tsx
  routes/        AppRoutes.tsx (all URLs), ProtectedRoute.tsx
  layouts/       WebsiteLayout.tsx, AdminLayout.tsx
  pages/website/ Home, About, Services, WebDevelopment, Projects, Contact, …
  pages/admin/   Login, Dashboard, ResourceList, ResourceForm, Settings, Profile
  components/    common/ (Carousel, Accordion, RichText), website/, admin/
  config/        adminResources.ts (columns + form fields for every admin table)
  services/      api.ts
  hooks/, context/, types/, data/, utils/
server/src/
  index.ts       app setup
  routes/        api.ts (JSON API), web.ts (sitemap, SEO injection, serves client/dist)
  controllers/   public, auth, admin, resource (generic CRUD)
  resources/     definitions.ts (table, validation and upload folder per admin table)
  middleware/, utils/, config/
```

### Adding a field or an admin table

1. Server: add the column's validation in `server/src/resources/definitions.ts`.
2. Client: add the column and form field in `client/src/config/adminResources.ts`.

The list page, form, validation messages and image upload all work from these two files.

## Scripts

| Command             | Does                                   |
| ------------------- | -------------------------------------- |
| `npm run dev`       | API + website with hot reload          |
| `npm run build`     | Type-check and build the client        |
| `npm start`         | Run the server (serves the build)      |
| `npm run typecheck` | Type-check server and client           |
| `npm run vercel-build` | Build `.vercel/output` for Vercel  |
