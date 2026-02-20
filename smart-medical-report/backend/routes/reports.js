const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const upload = require('../middleware/upload');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');
const {
  extractTextFromImage,
  generateDiseaseAnalysis,
  generateMedicationAnalysis,
  translateReport,
  extractTextFromPDF
} = require('../utils/geminiAI');

// Upload and analyze report
router.post('/analyze', protect, upload.single('report'), async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    filePath = req.file.path;
    const { language = 'English', reportType = 'digital' } = req.body;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Create initial report record
    const report = await Report.create({
      userId: req.user ? req.user._id : null,
      reportType,
      originalFileName: req.file.originalname,
      fileType: fileExt,
      language,
      status: 'processing'
    });

    // Extract text based on file type
    let extractedText = '';

    if (fileExt === '.pdf') {
      // PDF processing
      const pdfBuffer = fs.readFileSync(filePath);
      try {
        const pdfData = await pdfParse(pdfBuffer);
        extractedText = pdfData.text;
        if (extractedText.trim().length < 50) {
          // Scanned PDF - treat as image
          extractedText = await extractTextFromImage(filePath, 'application/pdf');
        } else {
          extractedText = await extractTextFromPDF(extractedText);
        }
      } catch (e) {
        extractedText = await extractTextFromImage(filePath, 'image/jpeg');
      }
    } else {
      // Image processing (JPG, PNG, etc.)
      const mimeTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.tiff': 'image/tiff', '.tif': 'image/tiff', '.bmp': 'image/bmp' };
      const mimeType = mimeTypes[fileExt] || 'image/jpeg';
      extractedText = await extractTextFromImage(filePath, mimeType);
    }

    if (!extractedText || extractedText.trim().length < 10) {
      await Report.findByIdAndUpdate(report._id, { status: 'failed', error: 'Could not extract text from the file' });
      return res.status(400).json({ success: false, message: 'Could not extract text from the uploaded file. Please ensure it is a clear medical report.' });
    }

    // Generate both reports simultaneously
    const [diseaseAnalysis, medicationAnalysis] = await Promise.all([
      generateDiseaseAnalysis(extractedText, language),
      generateMedicationAnalysis(extractedText, language)
    ]);

    // Update report with results
    const updatedReport = await Report.findByIdAndUpdate(
      report._id,
      {
        extractedText,
        diseaseAnalysis,
        medicationAnalysis,
        status: 'completed'
      },
      { new: true }
    );

    // Cleanup uploaded file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({
      success: true,
      reportId: updatedReport._id,
      report: updatedReport
    });

  } catch (error) {
    console.error('Report analysis error:', error);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ success: false, message: `Analysis failed: ${error.message}` });
  }
});

// Translate report
router.post('/translate/:reportId', protect, async (req, res) => {
  try {
    const { targetLanguage } = req.body;
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    // Build text to translate
    const report1Text = `
DISEASE ANALYSIS REPORT:
Diagnosed Conditions: ${report.diseaseAnalysis.diagnosedConditions?.join(', ')}
Causes: ${report.diseaseAnalysis.causes}
Early Symptoms: ${report.diseaseAnalysis.earlySymptoms}
Stages: ${report.diseaseAnalysis.stages}
Future Symptoms: ${report.diseaseAnalysis.futureSymptoms}
Prevention: ${report.diseaseAnalysis.prevention}
What to Eat: ${report.diseaseAnalysis.whatToEat}
What to Avoid: ${report.diseaseAnalysis.whatToAvoid}
How to Cure: ${report.diseaseAnalysis.howToCure}
Healthy Lifestyle: ${report.diseaseAnalysis.healthyLifestyle}
    `;

    const report2Text = report.medicationAnalysis.medications?.map(med => `
Medicine: ${med.name}
Why Given: ${med.whyGiven}
Benefits: ${med.benefits}
Dosage: ${med.dosage}
Timing: ${med.timing}
Before/After Food: ${med.beforeOrAfterFood}
    `).join('\n---\n');

    const [translatedReport1, translatedReport2] = await Promise.all([
      translateReport(report1Text, targetLanguage),
      translateReport(report2Text, targetLanguage)
    ]);

    // Save translation
    if (!report.translatedReports) report.translatedReports = new Map();
    report.translatedReports.set(targetLanguage, { report1: translatedReport1, report2: translatedReport2 });
    await report.save();

    res.json({
      success: true,
      language: targetLanguage,
      translatedReport1,
      translatedReport2
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get report by ID
router.get('/:reportId', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's reports
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user ? { userId: req.user._id } : {};
    const reports = await Report.find(query).sort({ createdAt: -1 }).select('-extractedText');
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete report
router.delete('/:reportId', protect, async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.reportId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;