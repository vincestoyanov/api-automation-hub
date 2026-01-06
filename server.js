const express = require('express');
const dotenv = require('dotenv');
const tasksRouter = require('./routes/tasks');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
