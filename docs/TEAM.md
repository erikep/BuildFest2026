# Team structure and ownership

4-person split per [FIRSTTASK.md](../FIRSTTASK.md) and [PROJECTPLAN.md](../PROJECTPLAN.md). Merge order: A → B → C/D.

| Person | Branch | Owns | Scope |
|--------|--------|------|--------|
| **A** (Database) | `feat/database-schema` | `prisma/`, `types/` | Schema, migrations, seed, shared TS types |
| **B** (Backend API) | `feat/backend-api` | `app/api/`, `lib/` | GET/POST (and other) API routes, DB connection, auth |
| **C** (Staff frontend) | `feat/staff-app` | `app/(staff)/` | Staff UI: `/staff`, `/staff/events/new`, dashboards, impact |
| **D** (Client frontend) | `feat/client-app` | `app/(client)/` | Client UI: `/` (landing), `/events`, notifications, volunteer |

## URL map

- **Client (public):** `/` = landing, `/events` = event list.
- **Staff:** `/staff` = staff home, `/staff/events/new` = create event.
- **API:** `/api/events` (GET list, POST create).

## Folder layout

```
app/
  layout.tsx          # Root layout (shared)
  globals.css
  (client)/           # Person D — client-facing routes
    layout.tsx
    page.tsx          # /
    events/
      page.tsx        # /events
  (staff)/            # Person C — staff-only routes
    layout.tsx
    staff/
      page.tsx        # /staff
      events/new/
        page.tsx      # /staff/events/new
  api/                # Person B — API routes
    events/
      route.ts
lib/                  # Person B — server utilities
prisma/               # Person A — schema, migrations, seed
types/                # Person A — shared TypeScript types (e.g. events.ts)
docs/                 # Team and planning docs
```

## Conflict avoidance

- **A** and **B:** Only A edits `prisma/` and `types/`; B consumes types and uses the Prisma client from `lib/`.
- **C** and **D:** Work in separate route groups `(staff)` and `(client)`; avoid editing the same shared components at the same time.
