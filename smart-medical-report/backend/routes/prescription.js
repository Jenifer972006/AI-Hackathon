const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');
const {
  extractTextFromImage,
  generateDiseaseAnalysis,
  generateMedicationAnalysis
} = require('../utils/geminiAI');

// Analyze handwritten prescription
router.post('/analyze', protect, upload.single('prescription'), async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    filePath = req.file.path;
    const { language = 'English' } = req.body;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Create initial record
    const report = await Report.create({
      userId: req.user ? req.user._id : null,
      reportType: 'handwritten',
      originalFileName: req.file.originalname,
      fileType: fileExt,
      language,
      status: 'processing'
    });

    // Extract text with special handwriting focus
    const mimeTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' };
    const mimeType = mimeTypes[fileExt] || 'image/jpeg';

    const extractedText = await extractTextFromImage(filePath, mimeType);

    if (!extractedText || extractedText.trim().length < 5) {
      await Report.findByIdAndUpdate(report._id, { status: 'failed', error: 'Could not read prescription' });
      return res.status(400).json({ success: false, message: 'Could not read the handwritten prescription. Please ensure the image is clear.' });
    }

    // Generate analyses
    const [diseaseAnalysis, medicationAnalysis] = await Promise.all([
      generateDiseaseAnalysis(extractedText, language),
      generateMedicationAnalysis(extractedText, language)
    ]);

    const updatedReport = await Report.findByIdAndUpdate(
      report._id,
      { extractedText, diseaseAnalysis, medicationAnalysis, status: 'completed' },
      { new: true }
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, reportId: updatedReport._id, report: updatedReport });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
