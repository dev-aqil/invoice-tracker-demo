# Architecture — Invoice Tracker

A beginner-oriented map of how one request travels from the screen to storage, using the actual files in this project.

## The three layers

| Layer | File | Job |
|---|---|---|
| Interface | `invoice-tracker/public/index.html` | What you see and click. Sends `fetch` requests, renders the list, shows loading/empty/success/error states. |
| Server | `invoice-tracker/server.js` | Listens on port 3000. Validates input, applies the rules, decides what may be saved. |
| Storage | `invoice-tracker/data/invoices.json` | The database. A plain JSON array of invoice objects. |

## Life of one request: "Add invoice"

1. **Screen → browser JS** — In `public/index.html`, the form's `submit` handler builds a JSON body `{ client, amount }` and calls `fetch("/api/invoices", { method: "POST", ... })`. It disables the button and shows "Saving…".
2. **Server receives** — `server.js` matches the POST to the route registered as `app.post("/api/invoices", ...)`. The `express.json()` middleware has already parsed the body.
3. **Validation** — The route checks the client name is a non-empty string and the amount is a positive number. Bad input stops here with HTTP 400 and an error message; nothing touches storage.
4. **Storage read** — `loadInvoices()` in `server.js` reads `data/invoices.json` and parses it into an array.
5. **Storage write** — The route appends a new invoice object (id, client, amount, paid, createdAt) and `saveInvoices()` writes the whole array back to `data/invoices.json`.
6. **Response** — The server replies HTTP 201 with the saved invoice.
7. **Screen updates** — Back in `index.html`, the code re-fetches `GET /api/invoices`, re-renders the list and the "Total unpaid" line, and shows "Invoice added."

## Life of a page load

- The browser requests `/`. `express.static(path.join(__dirname, "public"))` in `server.js` finds `public/index.html` and sends it.
- The page's JavaScript then calls `GET /api/invoices` to fill the list — the page itself contains no data.

## Why this shape

- Rules live in the server, not the page, so the data can never be changed by bypassing the screen's checks.
- Storage is just a file, so there is nothing to install and the data is human-readable.
- Each layer can be swapped later (e.g. JSON file → real database) without rewriting the other two.
