# 🏥 MedAI - Smart Medical Report Analysis

## Complete MERN Stack + Gemini AI Medical Report Analyzer

---

## 🔑 FREE API KEYS NEEDED (Only 1 Required!)

### 1. Google Gemini API Key ← MAIN AI ENGINE
- **Get it FREE at:** https://aistudio.google.com/app/apikey
- **Steps:** 
  1. Go to https://aistudio.google.com
  2. Sign in with your Google account
  3. Click "Get API key" → "Create API key"
  4. Copy the key
- **Free Tier Limits:** 15 requests/min, 1500 requests/day (Gemini 1.5 Flash)
- **Where to paste:** `backend/.env` → `GEMINI_API_KEY=your_key_here`

### 2. MongoDB (Free Option)
**Option A: Local MongoDB (Easiest)**
- Download: https://www.mongodb.com/try/download/community
- Default URI: `mongodb://localhost:27017/smart_medical_db`

**Option B: MongoDB Atlas (Cloud - No Installation)**
- Go to: https://www.mongodb.com/atlas
- Create free account → New Project → Create Free Cluster (M0)
- Click "Connect" → "Drivers" → Copy connection string
- Replace in `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/smart_medical_db`

---

## 📂 Project Structure

```
smart-medical-report/
├── backend/
│   ├── .env                    ← PUT API KEYS HERE
│   ├── server.js
│   ├── package.json
│   ├── models/
│   │   ├── User.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── reports.js
│   │   ├── chat.js
│   │   └── prescription.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   └── utils/
│       └── geminiAI.js         ← GEMINI API KEY USED HERE
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── AnalyzePage.js
│   │   │   ├── PrescriptionPage.js
│   │   │   ├── ReportPage.js
│   │   │   ├── ChatPage.js
│   │   │   ├── AccessibilityPage.js
│   │   │   ├── LoginPage.js
│   │   │   └── RegisterPage.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── FileUpload.js
│   │   │   └── LanguageSelector.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── utils/
│   │       └── api.js
│   └── package.json
└── README.md
```

---

## 🚀 Step-by-Step Setup in VS Code

### Prerequisites
Make sure these are installed:
- **Node.js** (v18+): https://nodejs.org/
- **VS Code**: https://code.visualstudio.com/
- **MongoDB** (Community): https://www.mongodb.com/try/download/community (Optional if using Atlas)

Check versions:
```bash
node --version
npm --version
```

---

### Step 1: Open Project in VS Code
```bash
# Open VS Code and open the smart-medical-report folder
# Or from terminal:
code smart-medical-report
```

---

### Step 2: Configure Your API Keys

Open `backend/.env` and replace these values:

```env
# REQUIRED: Get from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy_YOUR_ACTUAL_KEY_HERE

# Choose one:
MONGODB_URI=mongodb://localhost:27017/smart_medical_db
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/smart_medical_db
```

---

### Step 3: Install Backend Dependencies
```bash
# In VS Code terminal (Ctrl+`)
cd backend
npm install
```

---

### Step 4: Install Frontend Dependencies
```bash
# Open NEW terminal (Ctrl+Shift+`)
cd frontend
npm install
```

---

### Step 5: Start MongoDB (if using local)
```bash
# On Windows: MongoDB runs as a service automatically after install
# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

---

### Step 6: Start the Backend Server
```bash
# In backend terminal
cd backend
npm run dev
```
✅ You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected Successfully
```

---

### Step 7: Start the Frontend
```bash
# In frontend terminal
cd frontend
npm start
```
✅ Browser opens at http://localhost:3000

---

## 🎉 The App is Running!

Open: **http://localhost:3000**

### Test the App:
1. Go to **"Analyze Report"** → Upload any medical PDF or image
2. Wait 15-30 seconds for AI analysis
3. View your **Report 1** (Disease Analysis) and **Report 2** (Medication Guide)
4. Try **"Translate"** tab to get it in Hindi, Tamil, Telugu, etc.
5. Try the **AI Chat** → Ask questions about your report
6. Try **Accessibility** features with voice input/output

---

## 🔧 VS Code Recommended Extensions
- **ESLint** - Code quality
- **Prettier** - Code formatting  
- **MongoDB for VS Code** - View database
- **REST Client** or **Thunder Client** - Test APIs

---

## 🛑 Common Issues & Fixes

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
# Windows: Services → MongoDB → Start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### "Gemini API error" or "Invalid API key"
- Double check your key in `backend/.env`
- Make sure no extra spaces around the key
- Verify at: https://aistudio.google.com/app/apikey

### "Module not found" errors
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Port already in use
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
# Mac/Linux:
kill -9 $(lsof -t -i:5000)
```

---

## 📦 Running Both Servers Together (Advanced)

Install concurrently:
```bash
# In root directory
npm init -y
npm install concurrently
```

Add to root package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
  }
}
```

Then just run:
```bash
npm run dev
```

---

## 🌟 Features Summary

| Feature | Status |
|---------|--------|
| Digital Report Analysis (PDF/Image) | ✅ |
| Handwritten Prescription Analysis | ✅ |
| Report 1: Disease Analysis | ✅ |
| Report 2: Medication Guide | ✅ |
| 18+ Indian Languages Support | ✅ |
| Text-to-Speech (Read Aloud) | ✅ |
| Speech-to-Text (Voice Input) | ✅ |
| Visually Impaired Mode | ✅ |
| Hearing Impaired Mode | ✅ |
| Physically Challenged Mode | ✅ |
| Multilingual AI Chatbot | ✅ |
| User Authentication | ✅ |
| MongoDB Storage | ✅ |

---

## ⚠️ Medical Disclaimer
This application is for informational purposes only. Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment.
