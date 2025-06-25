# 🔒 Secure Setup Guide

This guide shows you how to set up the application with secure backend API handling for OpenAI integration.

## 🚨 Security Notice

The OpenAI API key is now handled **server-side only** for security. This prevents:
- API key exposure in browser
- Unauthorized usage
- Unexpected charges

## 📁 Project Structure

```
conversational-qa/
├── src/                    # Frontend (React/Vite)
├── server/                 # Backend (Express.js)
├── docs/                   # Documentation
└── README.md
```

## ⚙️ Setup Instructions

### 1. Install All Dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Configure Backend Environment

Create `server/.env`:

```bash
# Required: Your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Server configuration
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Configure Frontend Environment (Optional)

Create `.env.local` (optional - defaults to localhost:3001):

```bash
# Optional: Custom backend URL
VITE_API_URL=http://localhost:3001
```

## 🚀 Running the Application

### Option 1: One Command (Recommended)

```bash
npm run dev
```

This runs both frontend and backend simultaneously with colored output to distinguish between services.

### Option 2: Run Separately (Alternative)

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### Option 3: Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 🔍 How It Works

1. **Frontend** sends loan decision data to backend
2. **Backend** securely calls OpenAI API with SOP context
3. **AI Analysis** happens server-side with full SOP
4. **Results** returned to frontend for display

## 📊 API Endpoints

### Quality Check
```http
POST /api/quality-check
Content-Type: application/json

{
  "loanDecision": {
    "applicantName": "John Doe",
    "loanAmount": 450000,
    "annualIncome": 95000,
    "creditScore": 720,
    "debtToIncomeRatio": 28,
    "collateralValue": 500000,
    "employmentYears": 3.5,
    "decision": "approve",
    "riskLevel": "medium",
    "reasoning": "Strong credit profile...",
    "conditions": "None"
  }
}
```

### Health Check
```http
GET /api/health
```

## 🔧 Troubleshooting

### Backend Issues

**OpenAI API Key Not Working:**
- Verify key in `server/.env`
- Check API key has sufficient credits
- Ensure no extra spaces in `.env` file

**CORS Errors:**
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend runs on correct port

### Frontend Issues

**API Connection Failed:**
- Verify backend is running on port 3001
- Check `VITE_API_URL` if using custom backend URL
- Check browser console for errors

## 🌐 Production Deployment

### Backend Deployment (Railway/Heroku/etc.)
1. Deploy backend with environment variables
2. Set `FRONTEND_URL` to your frontend domain
3. Update frontend `VITE_API_URL` to backend URL

### Frontend Deployment (Vercel/Netlify/etc.)
1. Set `VITE_API_URL` to your backend URL
2. Deploy normally

## 🛡️ Security Features

- ✅ API key never exposed to browser
- ✅ CORS protection
- ✅ Request validation
- ✅ Error handling with fallbacks
- ✅ Rate limiting ready (add middleware)

## 📞 Support

If you encounter issues:
1. Check both backend and frontend console logs
2. Verify environment variables are set correctly
3. Ensure both services are running
4. Test the health endpoint: `http://localhost:3001/api/health` 