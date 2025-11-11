/**
 * Iterative resume optimizer using character-aware line counting
 * Removes lowest-scoring bullets until resume fits on exactly 1 page
 */

import { ResumeData } from '@/lib/docx/generator';
import { estimatePageCount, isOnePage } from '@/lib/docx/page-estimator';
import type { ScoredResumeData, ScoredExperience, ScoredProject, ScoredSkill } from '@/baml_client';

export interface RemovedBullet {
  type: 'experience' | 'project';
  itemTitle: string; // position/company or project name
  bulletText: string;
  score: number;
}

export interface OptimizedResumeResult {
  resumeData: ResumeData;
  estimatedPages: number;
  removedBullets: RemovedBullet[];
  iterations: number;
}

/**
 * Optimize resume to fit on one page by iteratively removing
 * lowest-scoring bullets until estimated page count <= 1
 */
export function optimizeForOnePageIterative(
  scoredData: ScoredResumeData
): OptimizedResumeResult {
  console.log('🎯 Starting iterative 1-page optimization (character-aware counting)...\n');

  // Start with all items
  let experiences: ScoredExperience[] = [...scoredData.scored_experiences];
  let projects: ScoredProject[] = [...scoredData.scored_projects];
  const skills: ScoredSkill[] = [...scoredData.scored_skills];

  const removedBullets: RemovedBullet[] = [];
  let iteration = 0;
  const MAX_ITERATIONS = 100; // Safety limit

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    // Build current resume data
    const currentResume = buildResumeData(experiences, projects, skills);

    // Estimate page count using character-aware line counting
    const metrics = estimatePageCount(currentResume);
    console.log(`\n🔄 Iteration ${iteration}: ${metrics.estimatedLines} lines = ${metrics.estimatedPages.toFixed(2)} pages`);

    // Check if we fit on 1 page
    if (isOnePage(metrics)) {
      console.log(`\n✅ Optimization complete! Resume fits on ${metrics.estimatedPages.toFixed(2)} page(s)`);
      console.log(`   Iterations: ${iteration}`);
      console.log(`   Bullets removed: ${removedBullets.length}`);

      return {
        resumeData: currentResume,
        estimatedPages: metrics.estimatedPages,
        removedBullets,
        iterations: iteration
      };
    }

    // Still too long - remove lowest-scoring bullet
    const bulletToRemove = findLowestScoredBullet(experiences, projects);

    if (!bulletToRemove) {
      console.warn('⚠️  No more bullets to remove - cannot fit on 1 page');
      const finalMetrics = estimatePageCount(currentResume);
      return {
        resumeData: currentResume,
        estimatedPages: finalMetrics.estimatedPages,
        removedBullets,
        iterations: iteration
      };
    }

    // Remove the bullet
    if (bulletToRemove.type === 'experience') {
      const exp = experiences.find(e =>
        e.position === bulletToRemove.itemTitle
      );
      if (exp) {
        exp.scored_descriptions = exp.scored_descriptions.filter(
          d => d.text !== bulletToRemove.bulletText
        );
        console.log(`   ❌ Removed exp bullet from "${exp.position}" (score: ${bulletToRemove.score.toFixed(2)})`);
        console.log(`      "${bulletToRemove.bulletText.substring(0, 60)}..."`);
      }
    } else {
      const proj = projects.find(p =>
        p.name === bulletToRemove.itemTitle
      );
      if (proj) {
        proj.scored_descriptions = proj.scored_descriptions.filter(
          d => d.text !== bulletToRemove.bulletText
        );
        console.log(`   ❌ Removed proj bullet from "${proj.name}" (score: ${bulletToRemove.score.toFixed(2)})`);
        console.log(`      "${bulletToRemove.bulletText.substring(0, 60)}..."`);
      }
    }

    removedBullets.push(bulletToRemove);

    // Clean up: Remove experiences/projects with 0 bullets
    const experiencesBefore = experiences.length;
    const projectsBefore = projects.length;

    experiences = experiences.filter(e => e.scored_descriptions.length > 0);
    projects = projects.filter(p => p.scored_descriptions.length > 0);

    const expRemoved = experiencesBefore - experiences.length;
    const projRemoved = projectsBefore - projects.length;

    if (expRemoved > 0) {
      console.log(`   🗑️  Removed ${expRemoved} experience(s) with 0 bullets`);
    }
    if (projRemoved > 0) {
      console.log(`   🗑️  Removed ${projRemoved} project(s) with 0 bullets`);
    }
  }

  // Hit max iterations
  console.warn(`⚠️  Hit maximum iterations (${MAX_ITERATIONS}) - stopping optimization`);
  const finalResume = buildResumeData(experiences, projects, skills);
  const finalMetrics = estimatePageCount(finalResume);

  return {
    resumeData: finalResume,
    estimatedPages: finalMetrics.estimatedPages,
    removedBullets,
    iterations: iteration
  };
}

/**
 * Find the lowest-scoring bullet across all experiences and projects
 */
function findLowestScoredBullet(
  experiences: ScoredExperience[],
  projects: ScoredProject[]
): RemovedBullet | null {
  let lowestBullet: RemovedBullet | null = null;
  let lowestScore = Infinity;

  // Check all experience bullets
  for (const exp of experiences) {
    for (const desc of exp.scored_descriptions) {
      if (desc.relevance_score < lowestScore) {
        lowestScore = desc.relevance_score;
        lowestBullet = {
          type: 'experience',
          itemTitle: exp.position,
          bulletText: desc.text,
          score: desc.relevance_score
        };
      }
    }
  }

  // Check all project bullets
  for (const proj of projects) {
    for (const desc of proj.scored_descriptions) {
      if (desc.relevance_score < lowestScore) {
        lowestScore = desc.relevance_score;
        lowestBullet = {
          type: 'project',
          itemTitle: proj.name,
          bulletText: desc.text,
          score: desc.relevance_score
        };
      }
    }
  }

  return lowestBullet;
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
    experiences: experiences.map(e => ({
      position: e.position,
      company: e.company,
      location: e.location,
      date_from: e.date_from,
      date_to: e.date_to,
      description: e.scored_descriptions.map(d => d.text)
    })),
    projects: projects.map(p => ({
      name: p.name,
      position: p.position || '',
      date_from: p.date_from,
      date_to: p.date_to,
      description: p.scored_descriptions.map(d => d.text)
    })),
    skills: skills.map(s => s.skill)
  };
}

/**
 * Select top-scored items without page optimization
 * (for when fitToOnePage is disabled)
 */
export function selectTopScoredItems(scoredData: ScoredResumeData): ResumeData {
  // Sort by average bullet score for experiences/projects
  const experiences = [...scoredData.scored_experiences].sort((a, b) => {
    const avgA = a.scored_descriptions.reduce((sum, d) => sum + d.relevance_score, 0) / a.scored_descriptions.length;
    const avgB = b.scored_descriptions.reduce((sum, d) => sum + d.relevance_score, 0) / b.scored_descriptions.length;
    return avgB - avgA;
  });

  const projects = [...scoredData.scored_projects].sort((a, b) => {
    const avgA = a.scored_descriptions.reduce((sum, d) => sum + d.relevance_score, 0) / a.scored_descriptions.length;
    const avgB = b.scored_descriptions.reduce((sum, d) => sum + d.relevance_score, 0) / b.scored_descriptions.length;
    return avgB - avgA;
  });

  const skills = [...scoredData.scored_skills].sort((a, b) => b.relevance_score - a.relevance_score);

  // Take top N (traditional approach, no page limit)
  return buildResumeData(
    experiences.slice(0, 4),
    projects.slice(0, 3),
    skills.slice(0, 6)
  );
}
