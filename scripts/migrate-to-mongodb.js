const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_generator';

// Import models
const experienceSchema = new mongoose.Schema({
  position: String,
  company: String,
  location: String,
  date_from: String,
  date_to: String,
  description: [String],
  tags: [String],
  isActive: { type: Boolean, default: true },
  displayOrder: Number,
}, { timestamps: true });

const skillSchema = new mongoose.Schema({
  category: String,
  items: String,
  proficiencyLevel: String,
  displayOrder: Number,
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: String,
  position: String,
  date_from: String,
  date_to: String,
  description: [String],
  technologies: [String],
  githubUrl: String,
  demoUrl: String,
  isActive: { type: Boolean, default: true },
  displayOrder: Number,
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);
const Skill = mongoose.model('Skill', skillSchema);
const Project = mongoose.model('Project', projectSchema);

// Paths to data sources
const PORTFOLIO_DIR = path.join(__dirname, '../../portfolio/src/data');
const RESUME_DATA_PATH = path.join(__dirname, '../../resume-generator/resume_data.json');

/**
 * Extract keywords/tags from text using common technology patterns
 */
function extractKeywords(text) {
  const keywords = new Set();

  // Common technologies to detect
  const techPatterns = [
    /\b(Python|Java|JavaScript|TypeScript|C\+\+|C#|Ruby|Go|Rust|Swift|Kotlin)\b/gi,
    /\b(React|Vue|Angular|Svelte|Next\.js|Nuxt\.js|Express|Django|Flask|Spring|Rails)\b/gi,
    /\b(Node\.js|Deno|Bun)\b/gi,
    /\b(MongoDB|PostgreSQL|MySQL|Redis|Elasticsearch|Firebase|Supabase)\b/gi,
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform|Jenkins|GitHub Actions)\b/gi,
    /\b(TensorFlow|PyTorch|scikit-learn|Pandas|NumPy|Keras)\b/gi,
    /\b(REST|GraphQL|gRPC|WebSocket)\b/gi,
    /\b(Git|CI\/CD|Agile|Scrum)\b/gi,
  ];

  techPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      keywords.add(match[0].toLowerCase());
    }
  });

  return Array.from(keywords);
}

/**
 * Main migration function
 */
async function migrate() {
  try {
    console.log('🚀 Starting migration to MongoDB...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing collections...');
    await Promise.all([
      Experience.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({})
    ]);
    console.log('✓ Collections cleared\n');

    // Migrate from resume_data.json (primary source)
    if (fs.existsSync(RESUME_DATA_PATH)) {
      console.log('Migrating from resume_data.json...');
      const resumeData = JSON.parse(fs.readFileSync(RESUME_DATA_PATH, 'utf8'));

      // Migrate skills
      if (resumeData.skills) {
        for (const [index, skill] of resumeData.skills.entries()) {
          await Skill.create({
            category: skill.category,
            items: skill.items,
            displayOrder: index
          });
        }
        console.log(`✓ Migrated ${resumeData.skills.length} skills`);
      }

      // Migrate experiences
      if (resumeData.experiences) {
        for (const [index, exp] of resumeData.experiences.entries()) {
          const text = `${exp.position} ${exp.company} ${exp.description.join(' ')}`;
          const tags = extractKeywords(text);

          await Experience.create({
            position: exp.position,
            company: exp.company,
            location: exp.location,
            date_from: exp.date_from,
            date_to: exp.date_to,
            description: exp.description,
            tags,
            isActive: true,
            displayOrder: index
          });
        }
        console.log(`✓ Migrated ${resumeData.experiences.length} experiences`);
      }

      // Migrate projects
      if (resumeData.projects) {
        for (const [index, proj] of resumeData.projects.entries()) {
          const text = `${proj.name} ${proj.description.join(' ')}`;
          const technologies = extractKeywords(text);

          await Project.create({
            name: proj.name,
            position: proj.position || '',
            date_from: proj.date_from,
            date_to: proj.date_to,
            description: proj.description,
            technologies,
            isActive: true,
            displayOrder: index
          });
        }
        console.log(`✓ Migrated ${resumeData.projects.length} projects`);
      }
    } else {
      console.warn('⚠ resume_data.json not found, skipping...');
    }

    // Also check portfolio data as fallback/supplement
    const portfolioHistoryPath = path.join(PORTFOLIO_DIR, 'history.json');
    const portfolioProjectsPath = path.join(PORTFOLIO_DIR, 'projects.json');

    if (fs.existsSync(portfolioHistoryPath)) {
      console.log('\nChecking portfolio history.json for additional data...');
      const historyData = JSON.parse(fs.readFileSync(portfolioHistoryPath, 'utf8'));

      // Add any unique experiences not already in database
      if (historyData.length > 0) {
        console.log(`Found ${historyData.length} additional work history entries`);
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nDatabase summary:');
    console.log(`  - Experiences: ${await Experience.countDocuments()}`);
    console.log(`  - Skills: ${await Skill.countDocuments()}`);
    console.log(`  - Projects: ${await Project.countDocuments()}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ MongoDB connection closed');
  }
}

// Run migration
migrate();
