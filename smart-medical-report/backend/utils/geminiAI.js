const Groq = require('groq-sdk');
const fs = require('fs');
const Tesseract = require('tesseract.js');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callAI(prompt) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048,
  });
  return completion.choices[0].message.content;
}

async function extractTextFromImage(imagePath, mimeType = 'image/jpeg') {
  try {
    // Use Tesseract OCR to extract text from image
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });
    if (text && text.trim().length > 10) {
      return text;
    }
    throw new Error('No text found');
  } catch (err) {
    console.error('OCR error:', err.message);
    throw new Error('Could not extract text from image');
  }
}

async function generateDiseaseAnalysis(reportText, language = 'English') {
  const prompt = `You are an expert medical AI assistant. Analyze this medical report and provide a comprehensive patient-friendly explanation in ${language} language.

MEDICAL REPORT TEXT:
${reportText}

Provide a detailed JSON response with this EXACT structure (return ONLY JSON, no other text):
{
  "diagnosedConditions": ["condition1", "condition2"],
  "causes": "Detailed explanation of causes in simple terms",
  "earlySymptoms": "What early warning signs to look for",
  "stages": "Description of disease stages",
  "futureSymptoms": "What symptoms might develop if untreated",
  "prevention": "How to prevent worsening",
  "whatToEat": "Detailed food recommendations",
  "whatToAvoid": "Foods and habits to strictly avoid",
  "howToCure": "Treatment approach",
  "healthyLifestyle": "Specific lifestyle changes"
}`;

  const responseText = await callAI(prompt);
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error('Failed to parse disease analysis response');
}

async function generateMedicationAnalysis(reportText, language = 'English') {
  const prompt = `You are an expert medical AI assistant and pharmacist. Analyze this medical report in ${language} language.

MEDICAL REPORT TEXT:
${reportText}

Provide a detailed JSON response with this EXACT structure (return ONLY JSON, no other text):
{
  "medications": [
    {
      "name": "Medication name",
      "whyGiven": "Why this medicine is prescribed",
      "benefits": "What benefits this medicine provides",
      "dosage": "Exact dosage and frequency",
      "timing": "When to take - Morning/Afternoon/Evening/Night",
      "beforeOrAfterFood": "Before food / After food / With food"
    }
  ]
}`;

  const responseText = await callAI(prompt);
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error('Failed to parse medication analysis response');
}

async function translateReport(reportContent, targetLanguage) {
  const prompt = `Translate the following medical report content into ${targetLanguage} language. Maintain all medical accuracy. Provide ONLY the translated text.

CONTENT TO TRANSLATE:
${reportContent}`;
  return await callAI(prompt);
}

async function answerMedicalQuery(query, reportContext, language = 'English') {
  return answerMedicalQueryWithHistory(query, reportContext, language, []);
}

async function answerMedicalQueryWithHistory(query, reportContext, language = 'English', conversationHistory = []) {
  let historyText = '';
  if (conversationHistory.length > 0) {
    historyText = '\nCONVERSATION HISTORY:\n';
    conversationHistory.forEach(msg => {
      historyText += `${msg.role === 'user' ? 'Patient' : 'AI Doctor'}: ${msg.content}\n`;
    });
  }

  const prompt = `You are a helpful medical AI assistant. Remember the full conversation and answer follow-up questions naturally.

${reportContext ? `PATIENT REPORT CONTEXT:\n${reportContext}\n` : ''}
${historyText}

CURRENT QUESTION (answer in ${language}):
${query}

Be warm, simple, and practical. For serious concerns say "please consult your doctor".`;

  return await callAI(prompt);
}

async function extractTextFromPDF(pdfText) {
  const prompt = `Clean and structure this extracted medical PDF text, preserving ALL medical information. Return the cleaned text only.

${pdfText}`;
  return await callAI(prompt);
}

module.exports = {
  extractTextFromImage,
  generateDiseaseAnalysis,
  generateMedicationAnalysis,
  translateReport,
  answerMedicalQuery,
  answerMedicalQueryWithHistory,
  extractTextFromPDF
};