# Deploy Tommie Shelf on Railway

This guide walks you through hosting the app on [Railway](https://railway.app) with SQLite on a persistent volume.

---

## Deploy failing with "Environment variable not found: DATABASE_URL"?

The container **must** have `DATABASE_URL` set or Prisma will exit and the app will never start.

1. In Railway, open your **project** → select the **service** (your app).
2. Go to the **Variables** tab.
3. Click **+ New Variable** (or **Add Variable**).
4. Name: **`DATABASE_URL`**  
   Value: **`file:/data/sqlite.db`**
5. Save. Railway will redeploy automatically. If you already added a volume mounted at `/data`, the next deploy should succeed.

---

## Prerequisites

- A [Railway](https://railway.app) account (GitHub login)
- This repo pushed to **GitHub**

---

## 1. Create a new project on Railway

1. Go to [railway.app](https://railway.app) and log in.
2. Click **New Project**.
3. Choose **Deploy from GitHub repo** and select your `TommieShelfApp` (or fork) repository.
4. Railway will create a new **service** from the repo. Wait for the first build to finish (it may fail until we add the database volume and env vars—that’s OK).

---

## 2. Add a volume for SQLite

SQLite needs a persistent disk. Railway gives you that with a **volume**.

1. In your project, open the **service** (the one that runs your app).
2. Go to the **Variables** tab, then open the **Volumes** section (or use **+ New** → **Volume**).
3. Click **Add Volume** (or **Create Volume**).
4. **Mount path:** use `/data` (default is fine).
5. **Size:** 1 GB is enough to start.
6. Attach this volume to your app service (same service that runs the Next.js app).

---

## 3. Set environment variables

In the same service, go to **Variables** and add:

| Variable | Value | Required |
|----------|--------|----------|
| `DATABASE_URL` | `file:/data/sqlite.db` | Yes (so Prisma uses the volume) |
| `NODE_ENV` | `production` | Optional (Railway often sets this) |
| `RESEND_API_KEY` | Your Resend API key | Only if you use “Notify me” email |

- **Important:** Use exactly `file:/data/sqlite.db` so the database file lives on the volume you mounted at `/data`.
- Do **not** commit `.env` or real keys to the repo; set everything in Railway’s Variables.

---

## 4. Use the correct start command

The repo is set up to run migrations then start the app:

- **Start command:** `npm run deploy:start`  
  That runs `prisma migrate deploy` then `next start`.

If you didn’t use the included `railway.toml`, set the start command in the service:

1. Open your service → **Settings** (or **Deploy**).
2. Find **Deploy** or **Start Command**.
3. Set it to: `npm run deploy:start`

With the included `railway.toml`, this is already set.

---

## 5. Redeploy

1. Trigger a new deploy (e.g. **Deploy** → **Redeploy**, or push a new commit).
2. Check the **Deploy** / **Logs** tab:
   - Build should run: `prisma generate`, then `next build`.
   - On start you should see Prisma running migrations, then “Ready” from Next.js.
3. Open the **Public URL** Railway gives you (e.g. **Settings** → **Networking** → **Generate domain** or the default `*.railway.app`).

---

## 6. (Optional) Seed the database

To load initial data (events, resources, action items) on the **hosted** DB:

1. Install Railway CLI: `npm i -g @railway/cli` (or see [Railway CLI](https://docs.railway.app/develop/cli)).
2. Log in: `railway login`.
3. Link the project: `railway link` (choose the project and service).
4. Run the seed against the production DB (uses `DATABASE_URL` from Railway):
   ```bash
   railway run npm run db:seed
   ```
   Only do this once; re-running may duplicate data depending on your seed script.

---

## Troubleshooting

- **Build fails on “prisma generate”**  
  Ensure `prisma` is in `dependencies` (not only `devDependencies`) so Railway runs it during build, or keep the current `prisma generate` in the `build` script.

- **App starts but DB errors / “no such table”**  
  - Confirm `DATABASE_URL` is `file:/data/sqlite.db`.
  - Confirm the volume is attached to this service and mounted at `/data`.
  - Check logs for `prisma migrate deploy`; it must run before `next start`.

- **Data disappears after redeploy**  
  Data is only persisted on the volume. Confirm the volume is attached and `DATABASE_URL` points to a path on that volume (e.g. `file:/data/sqlite.db`).

- **Need Resend (email)**  
  Add `RESEND_API_KEY` (and optionally `RESEND_FROM_EMAIL`) in Railway Variables and redeploy.

---

## Summary

- **Build:** `prisma generate && next build`
- **Start:** `npm run deploy:start` → `prisma migrate deploy && next start`
- **Database:** SQLite at `file:/data/sqlite.db` on a Railway volume mounted at `/data`.
- **Env:** Set `DATABASE_URL` and any other keys in Railway Variables, not in the repo.
