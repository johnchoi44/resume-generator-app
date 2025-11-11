import { ResumeData } from './generator';

export interface ContentMetrics {
  experienceCount: number;
  projectCount: number;
  skillCategoryCount: number;
  totalBulletPoints: number;
  estimatedLines: number;
  estimatedPages: number;
  breakdown: {
    headerLines: number;
    experienceLines: number;
    projectLines: number;
    skillLines: number;
  };
}

// Constants - user specified
const LINES_PER_PAGE = 45;
const HEADER_LINES = 5; // Name, contact, title

// Per-item metadata lines (not including bullets)
const EXPERIENCE_METADATA_LINES = 2; // Position, company + location, date
const PROJECT_METADATA_LINES = 1;     // Name + date
const LINES_PER_SKILL_CATEGORY = 1;   // Base: category name + items (1 line)

// Character thresholds for line wrapping
const SKILL_LINE_CHAR_THRESHOLD = 115;
const BULLET_CHAR_THRESHOLD = 130;

/**
 * Estimate page count by dynamically counting actual bullet points
 * in experiences and projects
 */
export function estimatePageCount(resumeData: ResumeData): ContentMetrics {
  const experienceCount = resumeData.experiences?.length || 0;
  const projectCount = resumeData.projects?.length || 0;
  const skillCategoryCount = resumeData.skills?.length || 0;

  let totalLines = 0;
  let totalBulletPoints = 0;

  // Header (name, contact, title)
  const headerLines = HEADER_LINES;
  totalLines += headerLines;

  // Experiences section
  let experienceLines = 0;
  if (experienceCount > 0) {
    experienceLines += 1; // Section header "EXPERIENCE"

    for (const exp of resumeData.experiences) {
      // Metadata: position, company + location, date (2 lines)
      experienceLines += EXPERIENCE_METADATA_LINES;

      // Bullet points with character-aware counting
      for (const bullet of exp.description || []) {
        // Check if bullet text is long enough to wrap to 2 lines
        const bulletLines = bullet.length > BULLET_CHAR_THRESHOLD ? 2 : 1;
        experienceLines += bulletLines;
        totalBulletPoints++;
      }
    }
  }
  totalLines += experienceLines;

  // Projects section
  let projectLines = 0;
  if (projectCount > 0) {
    projectLines += 1; // Section header "PROJECTS"

    for (const proj of resumeData.projects) {
      // Metadata: name + date (1 line)
      projectLines += PROJECT_METADATA_LINES;

      // Bullet points with character-aware counting
      for (const bullet of proj.description || []) {
        // Check if bullet text is long enough to wrap to 2 lines
        const bulletLines = bullet.length > BULLET_CHAR_THRESHOLD ? 2 : 1;
        projectLines += bulletLines;
        totalBulletPoints++;
      }
    }
  }
  totalLines += projectLines;

  // Skills section
  let skillLines = 0;
  if (skillCategoryCount > 0) {
    skillLines += 1; // Section header "SKILLS"

    for (const skill of resumeData.skills) {
      // Calculate full skill line length: "Category: item1 | item2 | item3"
      const skillItems = Array.isArray(skill.items) ? skill.items : [skill.items];
      const fullSkillLine = `${skill.category}: ${skillItems.join(' | ')}`;

      // Check if skill line is long enough to wrap to 2 lines
      const lines = fullSkillLine.length > SKILL_LINE_CHAR_THRESHOLD ? 2 : 1;
      skillLines += lines;
    }
  }
  totalLines += skillLines;

  const estimatedPages = totalLines / LINES_PER_PAGE;

  return {
    experienceCount,
    projectCount,
    skillCategoryCount,
    totalBulletPoints,
    estimatedLines: totalLines,
    estimatedPages,
    breakdown: {
      headerLines,
      experienceLines,
      projectLines,
      skillLines
    }
  };
}

/**
 * Check if resume fits on one page
 */
export function isOnePage(metrics: ContentMetrics): boolean {
  return metrics.estimatedPages <= 1.0;
}

/**
 * Helper to log detailed metrics for debugging
 */
export function logMetrics(metrics: ContentMetrics): void {
  console.log('📊 Page Estimation Metrics:');
  console.log(`  Header: ${metrics.breakdown.headerLines} lines`);
  console.log(`  Experiences (${metrics.experienceCount}): ${metrics.breakdown.experienceLines} lines`);
  console.log(`  Projects (${metrics.projectCount}): ${metrics.breakdown.projectLines} lines`);
  console.log(`  Skills (${metrics.skillCategoryCount}): ${metrics.breakdown.skillLines} lines`);
  console.log(`  Total Bullets: ${metrics.totalBulletPoints}`);
  console.log(`  Total Lines: ${metrics.estimatedLines}`);
  console.log(`  Estimated Pages: ${metrics.estimatedPages.toFixed(2)}`);
}
