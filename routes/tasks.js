const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/tasks/create', async (req, res) => {
  const startTime = Date.now();
  try {
    const { crispData, payload } = req.body;
    if (!crispData && !payload) {
      return res.status(400).json({ error: 'Missing crispData or payload' });
    }
    let taskPayload;
    if (crispData) {
      const { subject, message, senderName, senderEmail, urgency } = crispData;
      const isPaymentRelated = /payment|invoice|overdue|dunning|bill|charge/i.test(message + subject);
      const priority = isPaymentRelated || urgency === 'urgent' ? 1 : 3;
      let taskName = subject.trim();
      if (taskName.length > 100) taskName = taskName.substring(0, 97) + '...';
      const description = `From: ${senderName} <${senderEmail}>\nSubject: ${subject}\n\nMessage: ${message}\n\nContext: ${isPaymentRelated ? 'Payment/Invoice - URGENT' : 'Follow-up required'}`;
      taskPayload = {
        name: taskName,
        description: description,
        priority: priority,
        due_date: 1735689600000,
        status: 'to do'
      };
    } else {
      taskPayload = payload;
    }
    const response = await axios.post(
      `${process.env.CLICKUP_API_ENDPOINT}/list/${process.env.CLICKUP_LIST_ID}/task`,
      taskPayload,
      {
        headers: {
          'Authorization': process.env.CLICKUP_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    const duration = Date.now() - startTime;
    res.status(201).json({
      success: true,
      taskId: response.data.id,
      duration: `${duration}ms`,
      data: response.data
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
