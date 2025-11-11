import { estimatePageCount, isOnePage, logMetrics, ContentMetrics } from '@/lib/docx/page-estimator';
import { ResumeData } from '@/lib/docx/generator';
import type { ScoredResumeData, ScoredExperience, ScoredProject, ScoredSkill } from '@/baml_client';

export interface RemovedItem {
  type: 'experience' | 'project' | 'skill';
  item: any;
  score: number;
  reasoning: string;
}

export interface OptimizedResumeResult {
  resumeData: ResumeData;
  metrics: ContentMetrics;
  removedItems: RemovedItem[];
}

// Minimum content requirements
const MIN_EXPERIENCES = 2;
const MIN_PROJECTS = 1;
const MIN_SKILL_CATEGORIES = 2;

/**
 * Optimize resume to fit on one page by iteratively removing
 * lowest-scoring items until page count <= 1.0
 */
export async function optimizeForOnePage(
  scoredData: ScoredResumeData
): Promise<OptimizedResumeResult> {

  console.log('🎯 Starting 1-page optimization...');

  // Start with all items
  let experiences: ScoredExperience[] = [...scoredData.scored_experiences];
  let projects: ScoredProject[] = [...scoredData.scored_projects];
  let skills: ScoredSkill[] = [...scoredData.scored_skills];

  // Sort by score (descending - highest scores first)
  experiences.sort((a, b) => b.relevance_score - a.relevance_score);
  projects.sort((a, b) => b.relevance_score - a.relevance_score);
  skills.sort((a, b) => b.relevance_score - a.relevance_score);

  const removedItems: RemovedItem[] = [];

  // Build current resume data
  let currentResume = buildResumeData(experiences, projects, skills);
  let metrics = estimatePageCount(currentResume);

  console.log('📄 Initial state:');
  logMetrics(metrics);

  let iteration = 0;

  // Iteratively remove lowest-scoring items until fits on 1 page
  while (!isOnePage(metrics)) {
    iteration++;
    console.log(`\n🔄 Iteration ${iteration}: ${metrics.estimatedPages.toFixed(2)} pages, removing item...`);

    // Find globally lowest-scoring removable item
    const lowestExp = experiences.length > MIN_EXPERIENCES ? experiences[experiences.length - 1] : null;
    const lowestProj = projects.length > MIN_PROJECTS ? projects[projects.length - 1] : null;
    const lowestSkill = skills.length > MIN_SKILL_CATEGORIES ? skills[skills.length - 1] : null;

    // Determine which item has lowest score
    let toRemove: { type: 'experience' | 'project' | 'skill'; item: any; score: number; reasoning: string } | null = null;

    if (lowestExp && (!toRemove || lowestExp.relevance_score < toRemove.score)) {
      toRemove = {
        type: 'experience',
        item: lowestExp.experience,
        score: lowestExp.relevance_score,
        reasoning: lowestExp.reasoning
      };
    }
    if (lowestProj && (!toRemove || lowestProj.relevance_score < toRemove.score)) {
      toRemove = {
        type: 'project',
        item: lowestProj.project,
        score: lowestProj.relevance_score,
        reasoning: lowestProj.reasoning
      };
    }
    if (lowestSkill && (!toRemove || lowestSkill.relevance_score < toRemove.score)) {
      toRemove = {
        type: 'skill',
        item: lowestSkill.skill,
        score: lowestSkill.relevance_score,
        reasoning: lowestSkill.reasoning
      };
    }

    // If no item can be removed (at minimums), break
    if (!toRemove) {
      console.warn('⚠️ Cannot fit to 1 page even with minimum content');
      console.warn(`   Minimum: ${MIN_EXPERIENCES} exp, ${MIN_PROJECTS} proj, ${MIN_SKILL_CATEGORIES} skills`);
      break;
    }

    // Remove the lowest-scoring item
    if (toRemove.type === 'experience') {
      experiences.pop();
      console.log(`  ❌ Removed experience: "${toRemove.item.position}" (score: ${toRemove.score.toFixed(2)})`);
    } else if (toRemove.type === 'project') {
      projects.pop();
      console.log(`  ❌ Removed project: "${toRemove.item.name}" (score: ${toRemove.score.toFixed(2)})`);
    } else if (toRemove.type === 'skill') {
      skills.pop();
      console.log(`  ❌ Removed skill category: "${toRemove.item.category}" (score: ${toRemove.score.toFixed(2)})`);
    }

    removedItems.push(toRemove);

    // Recalculate metrics with dynamic bullet counting
    currentResume = buildResumeData(experiences, projects, skills);
    metrics = estimatePageCount(currentResume);

    console.log(`  📏 New estimate: ${metrics.estimatedLines} lines = ${metrics.estimatedPages.toFixed(2)} pages`);
  }

  console.log(`\n✅ Optimization complete!`);
  console.log(`   Final: ${metrics.estimatedPages.toFixed(2)} pages`);
  console.log(`   Removed: ${removedItems.length} items`);
  logMetrics(metrics);

  return {
    resumeData: currentResume,
    metrics,
    removedItems
  };
}

/**
 * Build ResumeData from scored items
 */
function buildResumeData(
  experiences: ScoredExperience[],
  projects: ScoredProject[],
  skills: ScoredSkill[]
): ResumeData {
  return {
    experiences: experiences.map(e => e.experience),
    projects: projects.map(p => p.project),
    skills: skills.map(s => s.skill)
  };
}

/**
 * Select top-scored items without page optimization
 * (for when fitToOnePage is disabled)
 */
export function selectTopScoredItems(scoredData: ScoredResumeData): OptimizedResumeResult {
  // Sort by score (descending)
  const experiences = [...scoredData.scored_experiences].sort((a, b) => b.relevance_score - a.relevance_score);
  const projects = [...scoredData.scored_projects].sort((a, b) => b.relevance_score - a.relevance_score);
  const skills = [...scoredData.scored_skills].sort((a, b) => b.relevance_score - a.relevance_score);

  // Take top N (traditional approach, no page limit)
  const resumeData: ResumeData = {
    experiences: experiences.slice(0, 4).map(e => e.experience),
    projects: projects.slice(0, 3).map(p => p.project),
    skills: skills.slice(0, 6).map(s => s.skill)
  };

  return {
    resumeData,
    metrics: estimatePageCount(resumeData),
    removedItems: []
  };
}
