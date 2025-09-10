const express = require('express');
const connectDB = require('./db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());
connectDB();
app.use('/tasks', taskRoutes);
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log();
});
