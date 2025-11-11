# AI Resume Generator

An intelligent resume customization system powered by BAML (Boundary AI Markup Language), GPT-4, and MongoDB. This application generates tailored resumes based on job requirements, keywords, and role descriptions.

## 🎯 Project Status

### ✅ Completed (Phase 1-3)

- [x] **Next.js 14 App Setup** - App Router, TypeScript, Tailwind CSS
- [x] **MongoDB Integration** - Mongoose schemas for experiences, skills, and projects
- [x] **BAML Configuration** - AI-powered resume customization with GPT-4
- [x] **Data Access Layer** - Database queries and data management
- [x] **API Routes** - `/api/generate-resume` and `/api/experiences`
- [x] **Migration Script** - Import data from JSON files to MongoDB

### 🚧 In Progress / Pending

- [ ] **MongoDB Atlas Setup** - Create cluster and get connection string
- [ ] **PDF Generation** - React-PDF components for resume rendering
- [ ] **Frontend UI** - Input form, preview, and download components
- [ ] **Rate Limiting** - Upstash Redis integration
- [ ] **Testing** - Unit, integration, and E2E tests
- [ ] **Deployment** - Vercel deployment with environment variables

---

## 📁 Project Structure

```
resume-generator-app/
├── app/
│   ├── api/
│   │   ├── generate-resume/route.ts    # Main resume generation endpoint
│   │   └── experiences/route.ts        # Fetch all resume data
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Home page
│   └── globals.css                     # Global styles
├── lib/
│   ├── db/
│   │   ├── mongoose.ts                 # MongoDB connection
│   │   ├── experiences.ts              # Data access layer
│   │   └── models/
│   │       ├── Experience.ts           # Experience model
│   │       ├── Skill.ts                # Skill model
│   │       └── Project.ts              # Project model
│   ├── baml/
│   │   └── generate-resume.ts          # BAML wrapper with fallback
│   └── pdf/                            # (To be created)
├── components/                         # (To be created)
│   ├── resume/
│   │   ├── InputForm.tsx
│   │   ├── Preview.tsx
│   │   └── DownloadButton.tsx
│   └── pdf/
│       └── ResumePDF.tsx
├── baml_src/
│   ├── clients.baml                    # OpenAI client config
│   └── resume_generator.baml           # BAML schemas and functions
├── baml_client/                        # Auto-generated BAML TypeScript client
├── scripts/
│   └── migrate-to-mongodb.js           # Data migration script
├── templates/                          # (Copy from resume-generator)
└── .env.example                        # Environment variables template
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster (512 MB)
3. Create a database user
4. Whitelist your IP address (or allow all: `0.0.0.0/0` for development)
5. Get your connection string

### 3. Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_generator?retryWrites=true&w=majority

# Google Gemini API Key (for BAML)
GOOGLE_API_KEY=AIzaSy...

# Optional: Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Migrate Data to MongoDB

Copy your resume data:

```bash
# Option 1: Use resume_data.json from /resume-generator
cp ../resume-generator/resume_data.json ./data/

# Option 2: The migration script will also check portfolio JSON files
# at ../portfolio/src/data/
```

Run the migration:

```bash
npm run migrate
```

### 5. Copy Resume Template

```bash
cp ../resume-generator/templates/Choi_Resume_template_working.docx ./templates/
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 API Endpoints

### POST /api/generate-resume

Generate a customized resume based on user input.

**Request:**
```json
{
  "keywords": ["React", "TypeScript", "Next.js"],
  "targetRole": "Senior Frontend Engineer",
  "jobDescription": "Optional full job posting text...",
  "format": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumeData": {
      "skills": [...],
      "experiences": [...],
      "projects": [...]
    },
    "generationTime": 2341
  }
}
```

### GET /api/experiences

Fetch all resume data from MongoDB.

**Response:**
```json
{
  "success": true,
  "data": {
    "experiences": [...],
    "skills": [...],
    "projects": [...],
    "lastUpdated": "2025-11-09T..."
  }
}
```

---

## 🧠 How It Works

### 1. Data Flow

```
User Input → API Route → MongoDB → BAML + GPT-4 → Customized Resume Data
```

### 2. BAML AI Processing

The `GenerateCustomizedResume` BAML function:
- Receives all your experiences, skills, and projects from MongoDB
- Analyzes the target role, keywords, and job description
- Uses Google Gemini to intelligently select and order the most relevant items
- Returns structured data matching the ResumeData schema

### 3. Fallback Mechanism

If BAML/Gemini fails:
- Falls back to keyword-based filtering
- Scores experiences and projects by keyword matches
- Reorders skills by relevance
- Ensures the API always returns valid resume data

---

## 📊 MongoDB Schema

### Experience Collection
```typescript
{
  position: string;
  company: string;
  location: string;
  date_from: string;
  date_to: string;
  description: string[];
  tags: string[];          // Auto-extracted keywords
  isActive: boolean;
  displayOrder: number;
}
```

### Skill Collection
```typescript
{
  category: string;
  items: string;           // Pipe-separated: "Python | Java | SQL"
  proficiencyLevel?: string;
  displayOrder: number;
}
```

### Project Collection
```typescript
{
  name: string;
  position?: string;
  date_from: string;
  date_to: string;
  description: string[];
  technologies: string[];  // Auto-extracted tech stack
  githubUrl?: string;
  demoUrl?: string;
  isActive: boolean;
  displayOrder: number;
}
```

---

## 🔍 Testing the API

### Using curl:

```bash
# Test API info
curl http://localhost:3000/api/generate-resume

# Generate resume
curl -X POST http://localhost:3000/api/generate-resume \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["Python", "Machine Learning"],
    "targetRole": "ML Engineer"
  }'

# Fetch all experiences
curl http://localhost:3000/api/experiences
```

### Using the Next.js app:

Once the frontend is complete, you'll have an interactive UI to:
1. Enter keywords or paste job descriptions
2. See real-time preview of generated resume
3. Download as PDF or DOCX

---

## 🛠️ Next Steps

### Phase 4: PDF Generation
- [ ] Create React-PDF components
- [ ] Design resume template matching current format
- [ ] Implement client-side PDF generation
- [ ] Add download functionality

### Phase 5: Frontend UI
- [ ] Build input form component
- [ ] Create resume preview component
- [ ] Add download button
- [ ] Implement quick presets (ML Engineer, Frontend, Backend)

### Phase 6: Polish
- [ ] Add rate limiting (Upstash Redis)
- [ ] Implement analytics tracking
- [ ] Write tests
- [ ] Deploy to Vercel

### Phase 7: Integration
- [ ] Link from main portfolio
- [ ] Style to match portfolio theme
- [ ] Add custom domain

---

## 📝 Development Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run migrate     # Migrate data to MongoDB
```

---

## 💰 Cost Estimation

- **MongoDB Atlas**: FREE (M0 tier - 512 MB)
- **Google Gemini API**: ~$0.001-0.002 per resume generation (15x cheaper than GPT-4!)
- **Vercel Hosting**: FREE (hobby tier)
- **Upstash Redis**: FREE (10K requests/day)

**Total**: ~$0.001-0.002 per resume + free infrastructure

**Note**: Gemini 1.5 Flash has generous free tier: 15 requests/minute, 1500 requests/day!

---

## 🔐 Environment Variables Needed

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `GOOGLE_API_KEY` | ✅ Yes | Google Gemini API key for BAML |
| `UPSTASH_REDIS_REST_URL` | ⚠️ Optional | For rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | ⚠️ Optional | For rate limiting |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Optional | For absolute URLs |

---

## 📚 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **AI**: BAML + Google Gemini
- **Document Generation**: docxtemplater
- **Deployment**: Vercel

---

## 🎨 Features

### Current Features
✅ AI-powered resume customization (Google Gemini)
✅ Keyword-based filtering fallback
✅ MongoDB data storage
✅ RESTful API endpoints
✅ TypeScript type safety
✅ Auto-generated BAML client
✅ DOCX generation with Word template

### Planned Features
🔲 Client-side PDF generation
🔲 Interactive preview
🔲 Multiple resume templates
🔲 Rate limiting
🔲 Analytics dashboard
🔲 ATS optimization score

---

## 📖 Documentation

- [BAML Documentation](https://docs.boundaryml.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [MongoDB with Mongoose](https://mongoosejs.com/)
- [React-PDF](https://react-pdf.org/)

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB URI is correct
echo $MONGODB_URI

# Test connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!'))"
```

### BAML Generation Errors
- Ensure `OPENAI_API_KEY` is set correctly
- Check OpenAI API quota and billing
- Review BAML client logs in console

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Regenerate BAML client
npx baml-cli generate

# Rebuild
npm run build
```

---

## 📄 License

MIT

---

**Built with ❤️ using Next.js, BAML, and MongoDB**
