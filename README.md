# Invoice Tracker

A minimal MVP for accounting/finance users: track client invoices, see the total unpaid, and mark invoices as paid. Built with plain HTML/CSS/JavaScript and Node.js/Express, storing data in a local JSON file. All sample data is fake.

## Setup

1. Install Node.js (v18 or newer) — check with `node -v`.
2. In this folder, install dependencies once:
   ```
   npm install
   ```
3. Start the server:
   ```
   node server.js
   ```
4. Open http://localhost:3000 in your browser.

## Directory map

```
invoice-tracker/
  server.js            Express server: static files + API routes + validation
  package.json         Project metadata and dependencies
  public/
    index.html         The whole interface (HTML + CSS + JS in one file)
  data/
    invoices.json      The "database" (auto-created; delete it to reset the app)
```

## Environment variables

None. This MVP keeps everything local — no secrets, no `.env` file, no external services. If real integrations (e.g. payment providers) are added later, their keys must live in a `.env` file listed in `.gitignore`, with a `.env.example` committed that contains names only.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/invoices` | List all invoices |
| POST | `/api/invoices` | Add an invoice (`client`, `amount`) |
| POST | `/api/invoices/:id/toggle` | Mark paid/unpaid |
| DELETE | `/api/invoices/:id` | Remove an invoice |

## Tests performed (2026-11-22)

- Adding a valid invoice returns 201 and persists to `data/invoices.json` (verified with curl).
- Empty client name or non-positive amount is rejected with HTTP 400 and a clear error message.
- Toggle changes `paid` both directions; unknown id returns 404.
- DELETE removes the invoice; unknown id returns 404.
- `GET /` returns HTTP 200 and the page renders in the browser (mobile and desktop widths).

Not verified: multi-user concurrent access, browser automation tests, deployment to any host.

## Known limitations

- The camera scan is simulated: an animated A4 invoice supplies fixed sample values for confirmation. It does not access the camera or perform OCR.
- Vercel can host the Express application, but the current JSON-file storage is not compatible with its read-only application filesystem. Before using invoice creation, updates or deletion on Vercel, replace file storage with a persistent database or adapt the app to browser-local storage. A live deployment has not been tested.
- The interface uses a phone-shaped frame with internal scrolling.

- Single-user, single-machine: no login, no roles, file storage can be corrupted by concurrent writes.
- Data lives only in `data/invoices.json` — no backups.
- No persistence encryption; do not store real financial data in it.
