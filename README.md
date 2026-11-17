# CodesExperts

Company website and admin panel, rebuilt from the previous Laravel app.

| Folder    | What it is                                                                            |
| --------- | ------------------------------------------------------------------------------------- |
| `client/` | React 19 + TypeScript + Tailwind CSS 4 (Vite). Public website **and** admin panel.    |
| `server/` | Node.js + Express + TypeScript API. MongoDB data, admin login, image uploads, emails. |

Data is stored in MongoDB (database `codesexperts-react-db`, one collection per former MySQL table). Uploaded images live in `server/uploads/`.

## Requirements

- Node.js 22.18 or newer (the server runs `.ts` files directly, with no build step)
- A MongoDB database (e.g. MongoDB Atlas). Put its connection string in `MONGODB_URI` in `server/.env`.
- To copy the old MySQL data in, set the `MYSQL_*` values in `server/.env` and run `npm --prefix server run migrate:mongo` (add `-- --replace` to overwrite existing data).

## Getting started

```bash
npm run setup                          # install all dependencies
cp server/.env.example server/.env     # then fill in MONGODB_URI, JWT_SECRET and SMTP settings
npm run dev                            # API on :4000, website on http://localhost:5173
```

- Website: http://localhost:5173
- Admin: http://localhost:5173/admin. Sign in with the existing admin account; passwords from Laravel still work.

## Production

```bash
npm run build      # builds client/dist
npm start          # Express serves the API, the uploads and the built site on PORT
```

Set `NODE_ENV=production`, a long random `JWT_SECRET`, `APP_URL`, and the SMTP settings in `server/.env`. Put the app behind HTTPS; admin cookies are marked `Secure` in production. Each page gets its SEO tags (from **Admin → Meta Tags**) in the HTML before JavaScript runs, so search engines can read them.

Enquiry and newsletter emails go to `ADMIN_EMAIL`. With `SMTP_HOST` left empty they are printed to the server log instead.

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
