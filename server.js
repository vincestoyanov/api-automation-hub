const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/test/create-task', async (req, res) => {
  try {
    const payload = {
      name: 'Encharge - Outstanding Invoice (Follow-up Payment)',
      description: 'From: Vince (vince@encharge.io)\nSubject: Encharge - Outstanding invoice\n\nMessage: Hey Margo, Happy New Year! This is a reminder that your invoice remains unpaid and has been in dunning since December 27, 2025. Please complete the payment at your earliest convenience to avoid any service interruption.\n\nContext: Payment overdue - urgent follow-up required',
      priority: 1,
      due_date: 1735689600000,
      status: 'to do'
    };
    const response = await axios.post(
      `${process.env.CLICKUP_API_ENDPOINT}/list/${process.env.CLICKUP_LIST_ID}/task`,
      payload,
      { headers: { 'Authorization': process.env.CLICKUP_API_KEY, 'Content-Type': 'application/json' } }
    );
    res.json({ success: true, taskId: response.data.id, data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});
