const fs = require('fs');
const csvParse = require('csv-parse').parse;
const csvStringify = require('csv-stringify').stringify;
const Customer = require('../models/Customer');
const Account = require('../models/Account');
module.exports = {
  importFile: async (req, res) => {
    try {
      const filePath = process.env.FILE_IMPORT_PATH + '/' + req.query.filename;
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
      const data = fs.readFileSync(filePath, 'utf8');
      csvParse(data, { columns: true }, async (err, records) => {
        if (err) return res.status(400).json({ error: 'Parse error' });
        // Example import logic: create customers
        let imported = [];
        for (const rec of records) {
          const cust = await Customer.create(rec);
          imported.push(cust);
        }
        res.json({ imported });
      });
    } catch (err) {
      res.status(500).json({ error: 'Import failed', details: err });
    }
  },
  exportFile: async (req, res) => {
    try {
      const customers = await Customer.find({});
      csvStringify(customers.map(c => c.toObject()), { header: true }, (err, output) => {
        if (err) return res.status(400).json({ error: 'Stringify error' });
        const filePath = process.env.FILE_EXPORT_PATH + '/customers_export.csv';
        fs.writeFileSync(filePath, output);
        res.download(filePath);
      });
    } catch (err) {
      res.status(500).json({ error: 'Export failed', details: err });
    }
  }
};
