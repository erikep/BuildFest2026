# How to test that the code works

## 1. Verify the app builds

From the project root:

```bash
npm run build
```

If this finishes without errors, TypeScript and Next.js are fine.

---

## 2. Manual test in the browser

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open **http://localhost:3000** — you should see the client landing page.
3. Go to **http://localhost:3000/staff**, then click **Create event** (goes to `/staff/events/new`). Fill in title, date, location (and optional description), and submit.
4. You should see **"Event created successfully"** (the mock API returns 201).
5. Open **http://localhost:3000/events** to see the event list (uses GET /api/events).

---

## 3. Test the API directly with curl

With `npm run dev` running in another terminal:

**POST an event:**

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Food Drive","date":"2026-03-10","location":"Campus","description":"Monthly drive"}'
```

You should get a `201` response and a JSON object with `id`, `title`, `date`, `location`, `description`.

**Invalid request (missing required fields):**

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Only title"}'
```

You should get `400` and an error message.

---

## 4. Run the API smoke script (optional)

With the dev server already running (`npm run dev` in another terminal):

```bash
npm run test:api
```

This sends a POST to `/api/events` and prints whether it got a 201 and the expected shape. See [scripts/smoke-api.mjs](scripts/smoke-api.mjs).
