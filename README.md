# Invoice Tracker

Track client invoices, mark payments and see the total unpaid in a phone-shaped interface.

## Run locally

Install dependencies with `npm ci`, run `node server.js`, then open http://localhost:3000. The interface saves invoices in this browser using localStorage. The older server API remains available for local learning, but the interface no longer calls it.

## Deploy on Vercel

Import this repository and keep its root directory unchanged. The included vercel.json publishes the public directory as a static site. No environment variables or database are required. A hosted deployment has not been verified.

## Storage and scanning

Invoices persist across reloads in the same browser and origin. They are not shared between devices, browsers or domains. Clearing site data removes them. Existing server-side JSON invoices are preserved locally but are not automatically imported. Do not use this app to store sensitive financial information.

Scanning is simulated, with an animated A4 sample invoice and fixed values that can be edited before confirmation. No real camera access or OCR is performed.

## Checks

Run `npm test` to check validation, persistence, payment toggling, deletion and protection against overwriting malformed stored data.
