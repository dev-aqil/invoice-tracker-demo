(function (root) {
  const key = 'invoice-tracker.v1';
  function load() {
    const invoices = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(invoices) || invoices.some(i => !i || typeof i.id !== 'string' || typeof i.client !== 'string' || !Number.isFinite(i.amount) || i.amount <= 0 || typeof i.paid !== 'boolean')) {
      throw new Error('Stored invoices are invalid. Your data has not been overwritten.');
    }
    return invoices;
  }
  function save(invoices) {
    localStorage.setItem(key, JSON.stringify(invoices));
  }
  root.invoiceStore = {
    load,
    add(client, amount) {
      if (typeof client !== 'string' || !client.trim()) throw new Error('Client name is required.');
      const value = Number(amount);
      if (!Number.isFinite(value) || value <= 0) throw new Error('Amount must be a positive number.');
      const invoices = load();
      invoices.push({ id: crypto.randomUUID(), client: client.trim(), amount: value, paid: false, createdAt: new Date().toISOString() });
      save(invoices);
    },
    toggle(id) {
      const invoices = load();
      const invoice = invoices.find(i => i.id === id);
      if (!invoice) throw new Error('Invoice not found.');
      invoice.paid = !invoice.paid;
      save(invoices);
    },
    remove(id) {
      const invoices = load();
      if (!invoices.some(i => i.id === id)) throw new Error('Invoice not found.');
      save(invoices.filter(i => i.id !== id));
    }
  };
})(globalThis);
