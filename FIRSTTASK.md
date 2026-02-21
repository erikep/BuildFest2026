# Hackathon Development Strategy

## Overview

To avoid overwhelm and merge conflicts, we will build features vertically instead of completing the entire database, then API, then frontend separately.

Each feature will be built end to end:

Database → API → Staff UI → Client UI

This ensures we always have a working and demoable product.

---

# First Vertical Feature

## Goal

Staff creates an event → Client sees the event on the landing page

If this works, we already have a functional MVP.

---

# Team Responsibilities Per Feature

## Database (Person A)

### Scope
- Define Event model (id, title, date, location, description)
- Run migration
- Seed sample events

### Owns
/prisma

---

## Backend API (Person B)

### Scope
- GET /api/events
- POST /api/events
- Connect API to database

### Response Shape
```json
{
  "id": number,
  "title": string,
  "date": string,
  "location": string,
  "description": string
}
```

### Owns
/api

---

## Staff Frontend (Person C)

### Scope
- Event creation form
- Submit button calls POST /api/events

Can start with mocked API if backend is not ready.

### Owns
/app/(staff)

---

## Client Frontend (Person D)

### Scope
- Landing page
- Fetch GET /api/events
- Display event cards

Can begin with mock data:

```js
const mockEvents = [
  { id: 1, title: "Food Drive", date: "2026-03-10" }
];
```

### Owns
/app/(client)

---

# Development Rules

1. Frontend does not wait for backend. Use mock data.
2. Backend defines API response shape early.
3. Integrate only after each layer works independently.
4. Merge frequently into main.

---

# Implementation Order

## Phase 1
Make event creation and display fully functional.

## Phase 2
Add volunteer toggle and notification preferences. These can be simulated.

## Phase 3
Add impact page with summary statistics.

---

# Hackathon Priorities

- Working demo over perfect architecture
- Simulated features over unfinished real integrations
- Clear UX over complex infrastructure
- Speed over perfection

---

# Objective

By building vertical slices:
- Everyone works in parallel
- Merge conflicts are minimized
- We always have something demoable
- The team avoids overwhelm
