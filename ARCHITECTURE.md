# Architecture

The Vercel deployment serves public/index.html and public/storage.js as static files. There is no deployed API or database requirement.

The interface calls invoiceStore to load, validate, add, toggle and remove records. The store serializes the invoice array into localStorage under invoice-tracker.v1. Rendering uses textContent for user-entered values.

A malformed stored record raises an error instead of being overwritten. Storage failures are shown by the existing interface error handling. Data is scoped to the current browser and origin, without cross-device sync.

The legacy Express server serves the same public files locally and retains its original JSON-file API for learning. Those endpoints are not used by the interface or published in the static Vercel build. Existing data/invoices.json is ignored by Git and left untouched.

The scanner animates a sample document and pre-fills fixed values. Saving a confirmed scan uses the same validation and browser storage as manual entry.
