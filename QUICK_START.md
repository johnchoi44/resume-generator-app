# Quick Start Guide

Get your AI Resume Generator up and running in **5 minutes**!

---

## ⚡ Prerequisites

- Node.js v18+ installed
- A MongoDB Atlas account (free tier)
- A Google Gemini API key (free tier available!)

---

## 🚀 Setup Steps

### Step 1: Set Up MongoDB Atlas (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster:
   - Click "Build a Database"
   - Choose **M0 FREE** tier
   - Select a cloud provider & region
   - Click "Create Cluster"
4. Set up database access:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Give "Read and write to any database" permissions
5. Set up network access:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
6. Get connection string:
   - Go back to "Database" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`

### Step 2: Get Google Gemini API Key (1 minute)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the API key (starts with `AIzaSy...`)
6. **Save it immediately** - you'll need it in a moment!

**Note**: Gemini has a generous free tier with 15 requests/minute and 1500 requests/day!

### Step 3: Configure Environment (30 seconds)

1. In your terminal, navigate to the project:
   ```bash
   cd /Users/John/Desktop/resume-generator-app
   ```

2. Create `.env.local` from template:
   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` with your credentials:
   ```bash
   # Open in your favorite editor
   nano .env.local
   # or
   code .env.local
   ```

4. Replace the placeholder values:
   ```env
   # MongoDB - paste your connection string
   # Replace <password> with your actual password
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_generator?retryWrites=true&w=majority

   # Google Gemini - paste your API key
   GOOGLE_API_KEY=AIzaSy-your-key-here

   # Optional: Leave these for now
   # UPSTASH_REDIS_REST_URL=
   # UPSTASH_REDIS_REST_TOKEN=

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 4: Prepare Your Resume Data (1 minute)

**Option A: Use existing resume_data.json**

```bash
# If you have resume_data.json from /resume-generator
mkdir -p data
cp ../resume-generator/resume_data.json ./data/
```

**Option B: The migration script will also check portfolio data**

The script automatically looks for:
- `../resume-generator/resume_data.json`
- `../portfolio/src/data/history.json`
- `../portfolio/src/data/projects.json`

### Step 5: Migrate Data to MongoDB (30 seconds)

```bash
# Run the migration script
npm run migrate
```

You should see:
```
✓ Connected to MongoDB
✓ Collections cleared
✓ Migrated X skills
✓ Migrated X experiences
✓ Migrated X projects
✅ Migration completed successfully!
```

### Step 6: Start the App! (10 seconds)

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🎉 You're Done!

You should now see:

1. **Home Page** at `http://localhost:3000`
   - Click "Generate Resume →" button

2. **Resume Generator** at `http://localhost:3000/resume-generator`
   - Try the quick presets
   - Or add custom keywords
   - Click "Generate Resume"
   - Download your customized PDF!

---

## 🧪 Test the API Directly

Want to test the backend API?

```bash
# Test API info
curl http://localhost:3000/api/generate-resume

# Generate a resume
curl -X POST http://localhost:3000/api/generate-resume \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["React", "TypeScript", "Next.js"],
    "targetRole": "Frontend Engineer"
  }'

# Get all your resume data
curl http://localhost:3000/api/experiences
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem**: `MongooseServerSelectionError: Could not connect to any servers`

**Solutions**:
1. Check your connection string in `.env.local`
2. Make sure you replaced `<password>` with actual password
3. Verify IP is whitelisted in MongoDB Atlas Network Access
4. Check your internet connection

### Google Gemini API Error

**Problem**: `Error: Invalid API key`

**Solutions**:
1. Check your API key in `.env.local`
2. Make sure it starts with `AIzaSy`
3. Verify API is enabled in Google Cloud Console
4. Check if you've exceeded the free tier limits
5. Create a new API key if needed

### Migration Failed

**Problem**: `resume_data.json not found`

**Solutions**:
1. Check if file exists: `ls ../resume-generator/resume_data.json`
2. Create the file manually or copy from another location
3. Or use portfolio data as fallback (script checks there too)

### PDF Download Not Working

**Problem**: PDF doesn't download or is blank

**Solutions**:
1. Check browser console for errors
2. Make sure resume data was generated (check preview)
3. Try refreshing the page
4. Clear browser cache

---

## 💡 Tips

### Speed Up Generation

- **Use Fallback**: If you don't have a Gemini API key yet, the system will automatically use keyword-based filtering
- **Cache Results**: The system caches MongoDB queries for faster subsequent requests

### Cost Optimization

- Each resume generation costs ~$0.001-0.002 (15x cheaper than GPT-4!)
- Gemini 1.5 Flash has a generous **free tier**: 15 requests/minute, 1500 requests/day
- That's approximately **1500 resume generations per day for FREE**!

### Customize Your Resume

- Edit your data in MongoDB using the migration script
- Or use MongoDB Atlas web interface to manually edit
- Re-run migration script to update data

---

## 📚 Next Steps

1. **Customize the Design**
   - Edit `/components/pdf/ResumePDF.tsx` to change PDF styling
   - Modify `/components/resume/Preview.tsx` for web preview

2. **Add Your Personal Info**
   - Update `personalInfo` in resume generator page
   - Or pass it as props to components

3. **Deploy to Production**
   - See `README.md` for Vercel deployment instructions
   - Configure production environment variables

4. **Add Rate Limiting**
   - Set up Upstash Redis (free tier)
   - Uncomment rate limiting code

---

## 🎯 What You've Built

You now have a **fully functional AI-powered resume generator** that:

✅ Uses GPT-4 to intelligently select relevant experience
✅ Generates professional PDF resumes
✅ Has a beautiful web interface
✅ Stores data in MongoDB
✅ Includes fallback for AI failures
✅ Works completely client-side for PDF generation

---

## 🆘 Need Help?

1. Check `README.md` for detailed documentation
2. Review `IMPLEMENTATION_STATUS.md` for technical details
3. Check browser console for errors
4. Check terminal for server logs

---

**Happy Resume Generating! 🚀**
