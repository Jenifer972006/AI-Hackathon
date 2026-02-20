const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { answerMedicalQueryWithHistory } = require('../utils/geminiAI');
const Report = require('../models/Report');

// Chat with medical AI - supports full conversation history
router.post('/query', protect, async (req, res) => {
  try {
    const { query, reportId, language = 'English', conversationHistory = [] } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

    let reportContext = '';
    if (reportId) {
      const report = await Report.findById(reportId);
      if (report) {
        reportContext = `
Patient's Diagnosed Conditions: ${report.diseaseAnalysis?.diagnosedConditions?.join(', ')}
Medications: ${report.medicationAnalysis?.medications?.map(m => m.name).join(', ')}
Report Summary: ${report.extractedText?.substring(0, 500)}
        `;
      }
    }

    const answer = await answerMedicalQueryWithHistory(query, reportContext, language, conversationHistory);

    res.json({
      success: true,
      query,
      answer,
      language,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;