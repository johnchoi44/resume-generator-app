# ✅ Setup Checklist

Follow this checklist to get your AI Resume Generator running!

---

## Before You Start

Print this or keep it open in a tab as you work through setup.

**Estimated Time**: 5-10 minutes
**Required**: Internet connection, web browser

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create Account
- [ ] Go to https://www.mongodb.com/cloud/atlas/register
- [ ] Sign up with email or Google
- [ ] Verify your email if needed

### 1.2 Create Database
- [ ] Click "Build a Database"
- [ ] Select **M0 FREE** tier (no credit card needed)
- [ ] Choose cloud provider (AWS recommended)
- [ ] Choose region closest to you
- [ ] Name it `resume-generator` (or keep default)
- [ ] Click "Create Cluster" (takes 1-3 minutes)

### 1.3 Create Database User
- [ ] Go to "Database Access" in left sidebar
- [ ] Click "+ ADD NEW DATABASE USER"
- [ ] Choose "Password" authentication
- [ ] Enter username: `admin` (or your choice)
- [ ] Click "Autogenerate Secure Password"
- [ ] **IMPORTANT**: Copy and save the password!
- [ ] Select "Read and write to any database"
- [ ] Click "Add User"

### 1.4 Configure Network Access
- [ ] Go to "Network Access" in left sidebar
- [ ] Click "+ ADD IP ADDRESS"
- [ ] Click "ALLOW ACCESS FROM ANYWHERE" (for development)
- [ ] Click "Confirm"

### 1.5 Get Connection String
- [ ] Go back to "Database" in left sidebar
- [ ] Click "Connect" button on your cluster
- [ ] Select "Connect your application"
- [ ] Copy the connection string
- [ ] It looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`
- [ ] **Save this!** You'll need it in Step 3

---

## Step 2: OpenAI API Key

### 2.1 Create Account
- [ ] Go to https://platform.openai.com/signup
- [ ] Sign up with email or Google
- [ ] Verify your email

### 2.2 Add Payment Method (Optional but Recommended)
- [ ] Go to Settings → Billing
- [ ] Add a credit card
- [ ] Set a usage limit (e.g., $5/month)
- [ ] Note: You get $5 free credits on signup!

### 2.3 Create API Key
- [ ] Go to https://platform.openai.com/api-keys
- [ ] Click "+ Create new secret key"
- [ ] Name it: `Resume Generator`
- [ ] Copy the key (starts with `sk-proj-` or `sk-`)
- [ ] **IMPORTANT**: Save it immediately - you can't see it again!

---

## Step 3: Configure Your App

### 3.1 Navigate to Project
```bash
cd /Users/John/Desktop/resume-generator-app
```
- [ ] Open terminal
- [ ] Run the command above
- [ ] Verify you're in the right directory: `ls` should show `package.json`

### 3.2 Create Environment File
```bash
cp .env.example .env.local
```
- [ ] Run the command above
- [ ] Verify file was created: `ls -la | grep .env`

### 3.3 Edit .env.local
- [ ] Open `.env.local` in your editor:
  ```bash
  code .env.local
  # or
  nano .env.local
  # or
  open -a TextEdit .env.local
  ```

- [ ] Replace `MONGODB_URI` with your connection string from Step 1.5
  - [ ] **Important**: Replace `<password>` with the actual password!
  - [ ] Example: `mongodb+srv://admin:MyP@ssw0rd@cluster0.xxxxx.mongodb.net/resume_generator?retryWrites=true&w=majority`

- [ ] Replace `OPENAI_API_KEY` with your key from Step 2.3
  - [ ] Example: `OPENAI_API_KEY=sk-proj-abc123def456...`

- [ ] Save and close the file

### 3.4 Verify Environment File
- [ ] Run: `cat .env.local`
- [ ] Verify both values are filled in
- [ ] Verify no `<password>` placeholder remains
- [ ] Verify no spaces around the `=` signs

---

## Step 4: Prepare Resume Data

Choose one option:

### Option A: Copy from resume-generator project
```bash
cp /Users/John/Desktop/resume-generator/resume_data.json ./data/
```
- [ ] Run the command above
- [ ] Verify file copied: `ls data/`

### Option B: Migration script will find it automatically
- [ ] The script checks `../resume-generator/resume_data.json`
- [ ] And `../portfolio/src/data/*.json`
- [ ] No action needed if files are in those locations

---

## Step 5: Run Migration

```bash
npm run migrate
```

- [ ] Run the command above
- [ ] Wait for it to complete (5-30 seconds)
- [ ] Look for success messages:
  - [ ] `✓ Connected to MongoDB`
  - [ ] `✓ Migrated X skills`
  - [ ] `✓ Migrated X experiences`
  - [ ] `✓ Migrated X projects`
  - [ ] `✅ Migration completed successfully!`

### If you see errors:
- **MongoDB connection error**:
  - [ ] Check `.env.local` - is `MONGODB_URI` correct?
  - [ ] Check MongoDB Atlas - is IP whitelisted?
  - [ ] Check internet connection

- **File not found**:
  - [ ] Create `data/` folder: `mkdir data`
  - [ ] Copy resume_data.json to `data/` folder

---

## Step 6: Start the Application

```bash
npm run dev
```

- [ ] Run the command above
- [ ] Wait for "Ready" message
- [ ] Look for: `Local: http://localhost:3000`
- [ ] Keep this terminal window open!

---

## Step 7: Test the Application

### 7.1 Visit Landing Page
- [ ] Open browser
- [ ] Go to: http://localhost:3000
- [ ] Verify you see:
  - [ ] "AI Resume Generator" title
  - [ ] Feature cards
  - [ ] "Generate Resume →" button

### 7.2 Visit Resume Generator
- [ ] Click "Generate Resume →" button
- [ ] OR go to: http://localhost:3000/resume-generator
- [ ] Verify you see:
  - [ ] Input form on left
  - [ ] Empty state on right

### 7.3 Generate Your First Resume
- [ ] Click one of the preset buttons (e.g., "Frontend Engineer")
- [ ] Verify keywords appear as badges
- [ ] Click "Generate Resume"
- [ ] Wait 2-10 seconds
- [ ] Verify you see:
  - [ ] Success message with timing
  - [ ] Preview of resume
  - [ ] "Download PDF" button

### 7.4 Download PDF
- [ ] Click "Download PDF" button
- [ ] Verify PDF downloads
- [ ] Open the PDF
- [ ] Verify it looks professional
- [ ] Verify your experiences are included

---

## Step 8: Test Custom Generation

### 8.1 Try Custom Keywords
- [ ] Clear any existing keywords
- [ ] Add your own keywords:
  - [ ] Type a keyword
  - [ ] Press Enter or click "Add"
  - [ ] Add 3-5 keywords
- [ ] Click "Generate Resume"
- [ ] Verify results match your keywords

### 8.2 Try Job Description
- [ ] Find a real job posting online
- [ ] Copy the entire job description
- [ ] Paste into "Job Description" field
- [ ] Click "Generate Resume"
- [ ] Verify AI selects relevant experiences

---

## Step 9: Verify Everything Works

### API Tests (Optional)
Open a new terminal and run:

```bash
# Test API info
curl http://localhost:3000/api/generate-resume

# Test generation
curl -X POST http://localhost:3000/api/generate-resume \
  -H "Content-Type: application/json" \
  -d '{"keywords": ["Python", "JavaScript"], "targetRole": "Software Engineer"}'

# Test experiences endpoint
curl http://localhost:3000/api/experiences
```

- [ ] Run the commands above
- [ ] Verify you get JSON responses
- [ ] No error messages

---

## 🎉 You're Done!

If you checked all boxes, your AI Resume Generator is fully functional!

---

## 📝 Final Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] OpenAI API key working (check usage dashboard)
- [ ] `.env.local` file configured correctly
- [ ] Migration completed successfully
- [ ] App runs on http://localhost:3000
- [ ] Can generate resumes with presets
- [ ] Can generate resumes with custom keywords
- [ ] Can download PDFs
- [ ] PDFs look professional

---

## 🆘 Troubleshooting

### Dev server won't start
```bash
# Check if port 3000 is in use
lsof -ti:3000

# Kill the process if needed
lsof -ti:3000 | xargs kill -9

# Try again
npm run dev
```

### MongoDB connection fails
1. Check `.env.local` - is the URI correct?
2. Check MongoDB Atlas - is cluster running?
3. Check Network Access - is your IP whitelisted?
4. Try "Allow Access from Anywhere" in Network Access

### OpenAI API errors
1. Check `.env.local` - is key correct?
2. Check OpenAI dashboard - do you have credits?
3. Check usage limits - did you exceed them?
4. Try creating a new API key

### Migration fails
1. Check if `resume_data.json` exists
2. Try creating `data/` folder manually
3. Check file permissions
4. Look at error message carefully

### PDF won't download
1. Check browser console for errors
2. Try a different browser
3. Clear browser cache
4. Check if resume was generated (is preview showing?)

---

## 📞 Next Steps After Setup

### Immediate
- [ ] Read `README.md` for full documentation
- [ ] Customize with your personal information
- [ ] Test with different job descriptions
- [ ] Share with friends!

### This Week
- [ ] Customize PDF styling
- [ ] Adjust AI prompt for better results
- [ ] Generate resumes for real job applications
- [ ] Get feedback from others

### This Month
- [ ] Deploy to Vercel (production)
- [ ] Add rate limiting (Upstash Redis)
- [ ] Implement analytics
- [ ] Integrate with your portfolio

---

## 💡 Tips

1. **Keep `.env.local` secure** - Never commit it to git!
2. **Monitor OpenAI usage** - Check dashboard regularly
3. **Back up your data** - Export from MongoDB occasionally
4. **Test fallback mode** - Try without OpenAI key to test fallback
5. **Customize the prompt** - Edit BAML files to tune AI behavior

---

**Need help? Check `QUICK_START.md` for detailed troubleshooting!**

**Happy Resume Generating! 🚀**
