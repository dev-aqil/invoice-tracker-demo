// server.js — the "server" part of our app.
// It listens on port 3000, serves files from public/,
// and stores invoices in data/invoices.json.

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "data", "invoices.json");

// --- Storage helpers -------------------------------------------------
// The JSON file is our database. Each read opens the file, each write
// replaces it. Simple on purpose — fine for a single-user MVP.

function loadInvoices() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    // Missing or unreadable file = empty database, not a crash.
    return [];
  }
}

function saveInvoices(invoices) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(invoices, null, 2));
}

// --- API routes ------------------------------------------------------

// Let the server read JSON request bodies sent by the browser form.
app.use(express.json());

// GET /api/invoices — the browser asks for the full list.
app.get("/api/invoices", (req, res) => {
  res.json(loadInvoices());
});

// POST /api/invoices — the browser sends a new invoice to save.
app.post("/api/invoices", (req, res) => {
  const { client, amount } = req.body || {};

  // Validation: bad input gets a clear error, never saved.
  if (!client || typeof client !== "string" || !client.trim()) {
    return res.status(400).json({ error: "Client name is required." });
  }
  const amountNum = Number(amount);
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  const invoices = loadInvoices();
  const invoice = {
    id: invoices.length ? invoices[invoices.length - 1].id + 1 : 1,
    client: client.trim(),
    amount: amountNum,
    paid: false,
    createdAt: new Date().toISOString(),
  };
  invoices.push(invoice);
  saveInvoices(invoices);
  res.status(201).json(invoice);
});

// POST /api/invoices/:id/toggle — mark an invoice paid/unpaid.
app.post("/api/invoices/:id/toggle", (req, res) => {
  const invoices = loadInvoices();
  const invoice = invoices.find((i) => i.id === Number(req.params.id));
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found." });
  }
  invoice.paid = !invoice.paid;
  saveInvoices(invoices);
  res.json(invoice);
});

// DELETE /api/invoices/:id — remove an invoice.
app.delete("/api/invoices/:id", (req, res) => {
  const invoices = loadInvoices();
  const index = invoices.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Invoice not found." });
  }
  const [removed] = invoices.splice(index, 1);
  saveInvoices(invoices);
  res.json(removed);
});

// --- Static files ----------------------------------------------------
// Serves public/index.html for "/" and any other assets.
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Invoice tracker running at http://localhost:${PORT}`);
});
