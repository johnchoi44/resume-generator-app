# Resume Generator API Integration Guide

This guide shows how to integrate the Resume Generator API into your portfolio website.

## Architecture

```
Portfolio (Vite + React)  →  API Request  →  Resume Generator (Vercel)
   ↓ User Input                  ↓                   ↓ AI Processing
   ↓ Fetch Call              CORS + Auth          MongoDB + Gemini
   ↓ Display/Download            ↓                   ↓ Generate DOCX
   ← Resume Data            ← JSON Response      ← Return Result
```

---

## 1. Deployment Steps

### Step 1: Deploy to Vercel

```bash
cd /Users/John/Desktop/resume-generator-app

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and configure environment variables
```

### Step 2: Add Environment Variables in Vercel Dashboard

Go to: `https://vercel.com/your-project/settings/environment-variables`

Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `GOOGLE_API_KEY` | `AIza...` | Google Gemini API key |
| `RESUME_API_KEY` | Generate random (32+ chars) | API authentication key |
| `ALLOWED_ORIGINS` | `https://yourportfolio.com` | Your portfolio URL |

**Generate API Key:**
```bash
# On Mac/Linux
openssl rand -hex 32

# Or use online generator
# https://www.random.org/strings/
```

### Step 3: Get Your API URL

After deployment, Vercel gives you a URL like:
```
https://resume-generator-abc123.vercel.app
```

Save this - you'll need it for the portfolio integration.

---

## 2. API Endpoints

### POST /api/generate-resume

Generates a customized resume using AI.

**Request:**
```javascript
POST https://your-resume-api.vercel.app/api/generate-resume

Headers:
{
  "Content-Type": "application/json",
  "X-API-Key": "your_resume_api_key_here"
}

Body:
{
  "keywords": ["React", "TypeScript", "Node.js"],
  "jobDescription": "We are looking for a Full Stack Engineer...",
  "targetRole": "Full Stack Engineer",
  "fitToOnePage": true
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "resumeData": {
      "experiences": [
        {
          "position": "Software Engineer",
          "company": "Tech Company",
          "location": "San Francisco, CA",
          "date_from": "Jan 2022",
          "date_to": "Present",
          "description": [
            "Built **scalable APIs** serving **10M+ users**",
            "Led team of **5 engineers** in **agile sprints**"
          ]
        }
      ],
      "projects": [...],
      "skills": [...]
    },
    "generationTime": 2500,
    "metadata": {
      "estimatedPages": 0.98,
      "estimatedLines": 44,
      "totalBulletPoints": 15,
      "removedItems": [],
      "experienceCount": 3,
      "projectCount": 2,
      "skillCount": 5
    }
  }
}
```

### POST /api/download-docx

Converts generated resume to downloadable DOCX file.

**Request:**
```javascript
POST https://your-resume-api.vercel.app/api/download-docx

Headers:
{
  "Content-Type": "application/json",
  "X-API-Key": "your_resume_api_key_here"
}

Body:
{
  "resumeData": { /* full resumeData from generate-resume response */ },
  "targetRole": "Full Stack Engineer"
}
```

**Response:**
- Binary DOCX file
- Headers: `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Filename: `John_Choi_Resume_Full_Stack_Engineer_2025-11-11.docx`

---

## 3. Portfolio Integration Code

### Option A: Simple Function-Based (Vanilla JS/React)

Create a new file in your portfolio: `src/utils/resumeAPI.js`

```javascript
// src/utils/resumeAPI.js

const API_BASE_URL = 'https://your-resume-api.vercel.app';
const API_KEY = import.meta.env.VITE_RESUME_API_KEY; // Store in .env

/**
 * Generate a customized resume based on user input
 */
export async function generateResume({ keywords, jobDescription, targetRole, fitToOnePage = true }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        keywords,
        jobDescription,
        targetRole,
        fitToOnePage
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate resume');
    }

    const data = await response.json();
    return data.data; // Returns { resumeData, generationTime, metadata }
  } catch (error) {
    console.error('Resume generation error:', error);
    throw error;
  }
}

/**
 * Download generated resume as DOCX file
 */
export async function downloadResume(resumeData, targetRole) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/download-docx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        resumeData,
        targetRole
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate document');
    }

    // Create download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `John_Choi_Resume_${targetRole.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}
```

### Option B: React Component

Create: `src/components/ResumeGenerator/ResumeGenerator.jsx`

```javascript
import { useState } from 'react';
import { generateResume, downloadResume } from '../../utils/resumeAPI';
import styles from './ResumeGenerator.module.css';

export function ResumeGenerator() {
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse keywords from comma-separated string
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      // Generate resume
      const result = await generateResume({
        keywords: keywordArray,
        jobDescription,
        targetRole: targetRole || 'Software Engineer',
        fitToOnePage: true
      });

      setResumeData(result.resumeData);
      console.log('Generation time:', result.generationTime, 'ms');
      console.log('Estimated pages:', result.metadata.estimatedPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resumeData) return;

    setLoading(true);
    setError(null);

    try {
      await downloadResume(resumeData, targetRole || 'Software Engineer');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Generate Tailored Resume</h2>
      <form onSubmit={handleGenerate} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="targetRole">Target Role (optional)</label>
          <input
            id="targetRole"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g., Full Stack Engineer"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="keywords">Keywords (comma-separated)</label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., React, TypeScript, Node.js"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            required
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.buttons}>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Resume'}
          </button>

          {resumeData && (
            <button type="button" onClick={handleDownload} disabled={loading}>
              Download DOCX
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

### Add to Your Portfolio

In `src/App.jsx`, add the component:

```javascript
import { ResumeGenerator } from './components/ResumeGenerator/ResumeGenerator';

function App() {
  return (
    <>
      {/* Your existing components */}
      <Hero />
      <About />

      {/* Add resume generator section */}
      <section id="resume-generator">
        <ResumeGenerator />
      </section>

      <Experience />
      <Projects />
      <Contact />
    </>
  );
}
```

---

## 4. Environment Variables for Portfolio

Create `.env` in your portfolio root:

```bash
# Portfolio .env file
VITE_RESUME_API_KEY=your_resume_api_key_here
VITE_API_BASE_URL=https://your-resume-api.vercel.app
```

**IMPORTANT**:
- Add `.env` to `.gitignore`
- Never commit API keys to GitHub
- For deployed portfolio, add these in your hosting provider's dashboard

---

## 5. Testing

### Test Locally

1. Start resume API (if running locally):
```bash
cd /Users/John/Desktop/resume-generator-app
npm run dev
```

2. Update API URL in portfolio to `http://localhost:3000`

3. Test API calls from portfolio

### Test Production

1. Use deployed Vercel URL
2. Check browser console for CORS errors
3. Verify API key authentication works
4. Test file download

### Example cURL Test

```bash
# Test generate-resume endpoint
curl -X POST https://your-resume-api.vercel.app/api/generate-resume \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "keywords": ["React", "TypeScript"],
    "jobDescription": "Looking for a frontend engineer",
    "targetRole": "Frontend Engineer",
    "fitToOnePage": true
  }'
```

---

## 6. Troubleshooting

### CORS Error

**Symptom**: `Access-Control-Allow-Origin` error in browser console

**Solution**:
1. Check `ALLOWED_ORIGINS` in Vercel includes your portfolio URL
2. Verify middleware.ts is deployed
3. Check browser network tab for OPTIONS preflight request

### 401 Unauthorized

**Symptom**: API returns 401 error

**Solution**:
1. Verify `X-API-Key` header is included
2. Check API key matches between Vercel and portfolio
3. Ensure API key is not empty string

### Resume Generation Timeout

**Symptom**: Request takes too long or times out

**Solution**:
1. Check MongoDB connection is active
2. Verify Gemini API key is valid and has quota
3. Check Vercel function logs for errors

### Download Doesn't Work

**Symptom**: DOCX download fails or file is corrupt

**Solution**:
1. Check response is blob, not JSON
2. Verify MIME type is correct
3. Check browser allows downloads from cross-origin

---

## 7. Security Best Practices

- ✅ Never expose `RESUME_API_KEY` in frontend code
- ✅ Store API key in environment variables only
- ✅ Limit CORS to specific origins (not `*`)
- ✅ Add rate limiting if API is publicly accessible
- ✅ Monitor Vercel logs for unusual activity
- ✅ Rotate API keys periodically
- ✅ Consider adding usage analytics

---

## 8. Next Steps

Once integrated:
1. Add loading states and error handling
2. Style the form to match portfolio design
3. Add success messages
4. Consider caching generated resumes
5. Add analytics to track usage
6. Test on mobile devices
7. Get feedback and iterate

---

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test API endpoints with Postman/cURL
4. Check browser console for errors
5. Review middleware.ts CORS configuration

Good luck with the integration! 🚀
