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
const LINES_PER_PAGE = 44;
const HEADER_LINES = 5; // Name, contact, title

// Per-item metadata lines (not including bullets)
const EXPERIENCE_METADATA_LINES = 3; // Position, Company/Location, Date
const PROJECT_METADATA_LINES = 3;     // Name, Position/Role, Date
const LINES_PER_SKILL_CATEGORY = 2;   // Category name + items

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
      // Metadata: position, company/location, date
      experienceLines += EXPERIENCE_METADATA_LINES;

      // Bullet points (dynamic count)
      const bulletCount = exp.description?.length || 0;
      experienceLines += bulletCount;
      totalBulletPoints += bulletCount;
    }
  }
  totalLines += experienceLines;

  // Projects section
  let projectLines = 0;
  if (projectCount > 0) {
    projectLines += 1; // Section header "PROJECTS"

    for (const proj of resumeData.projects) {
      // Metadata: name, position/role, date
      projectLines += PROJECT_METADATA_LINES;

      // Bullet points (dynamic count)
      const bulletCount = proj.description?.length || 0;
      projectLines += bulletCount;
      totalBulletPoints += bulletCount;
    }
  }
  totalLines += projectLines;

  // Skills section
  let skillLines = 0;
  if (skillCategoryCount > 0) {
    skillLines += 1; // Section header "SKILLS"
    skillLines += skillCategoryCount * LINES_PER_SKILL_CATEGORY;
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
