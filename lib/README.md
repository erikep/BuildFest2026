# lib — Person B (Backend / server utilities)

This directory is for **server-only** code owned by **Person B**, e.g.:

- Prisma client instance (when DB is added)
- Auth helpers
- Shared server utilities used by `app/api/`

Frontend code in `app/(client)` and `app/(staff)` should not import from here unless it’s type-only or safe for the client.
