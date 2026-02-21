#!/usr/bin/env node
/**
 * Smoke test for POST /api/events.
 * Run with dev server already up: npm run dev (in one terminal), then node scripts/smoke-api.mjs
 */

const BASE = process.env.API_BASE ?? "http://localhost:3000";

async function main() {
  const url = `${BASE}/api/events`;
  const body = {
    title: "Smoke test event",
    date: "2026-12-01",
    location: "Test location",
    description: "Created by smoke-api.mjs",
  };

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Request failed (is the dev server running?):", err.message);
    process.exit(1);
  }

  const data = await res.json().catch(() => ({}));

  if (res.status !== 201) {
    console.error("Expected 201, got", res.status, data);
    process.exit(1);
  }

  const ok =
    typeof data.id === "number" &&
    data.title === body.title &&
    data.date === body.date &&
    data.location === body.location;
  if (!ok) {
    console.error("Unexpected response shape:", data);
    process.exit(1);
  }

  console.log("OK POST /api/events returned 201 with expected shape.");
}

main();
