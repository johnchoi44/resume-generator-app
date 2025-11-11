import { b } from '@/baml_client';
import type {
  ScoredResumeData,
  MasterExperienceData,
  UserResumeRequest,
} from '@/baml_client/types';
import { optimizeForOnePageIterative, selectTopScoredItems } from '@/lib/resume/optimizer';
import { estimatePageCount } from '@/lib/docx/page-estimator';
import { GenerateResumeOptions } from './generate-resume';

// Legacy interface for compatibility
export interface OptimizedResumeResult {
  resumeData: any;
  metrics: any;
  removedItems: any[];
}

/**
 * Generate scored resume data using BAML AI
 * Each item gets a correlation score (0.0-1.0) for optimization
 */
export async function generateScoredResume(
  request: GenerateResumeOptions,
  masterData: MasterExperienceData
): Promise<ScoredResumeData> {
  try {
    // Convert to BAML request format
    const bamlRequest: UserResumeRequest = {
      keywords: request.keywords || null,
      job_description: request.jobDescription || null,
      target_role: request.targetRole || null,
    };

    console.log('🤖 Calling BAML to generate scored resume...');

    // Call BAML function for scoring
    const scoredData = await b.GenerateScoredResume(bamlRequest, masterData);

    console.log('✓ BAML scoring successful');
    console.log(`  📊 Scored ${scoredData.scored_experiences.length} experiences`);
    console.log(`  📊 Scored ${scoredData.scored_projects.length} projects`);
    console.log(`  📊 Scored ${scoredData.scored_skills.length} skill categories`);

    return scoredData;

  } catch (error) {
    console.error('BAML scored generation failed:', error);
    throw error;
  }
}

/**
 * Generate optimized resume with optional 1-page fitting
 *
 * @param request User requirements (keywords, job description, target role)
 * @param masterData Complete resume data from database
 * @param fitToOnePage Whether to optimize for 1-page constraint
 * @returns Optimized resume with metrics and removed items
 */
export async function generateOptimizedResume(
  request: GenerateResumeOptions,
  masterData: MasterExperienceData,
  fitToOnePage: boolean
): Promise<OptimizedResumeResult> {

  console.log(`\n${'='.repeat(60)}`);
  console.log('🎯 Resume Generation Started');
  console.log(`   Mode: ${fitToOnePage ? '1-Page Optimization' : 'Top Scored Items'}`);
  console.log(`${'='.repeat(60)}\n`);

  // Get scored data from BAML
  const scoredData = await generateScoredResume(request, masterData);

  // If fitToOnePage enabled, use iterative optimization with character-aware counting
  if (fitToOnePage) {
    console.log('\n📏 1-Page optimization enabled - iterative bullet removal with character-aware counting');
    const result = optimizeForOnePageIterative(scoredData);

    // Get full metrics for the optimized resume
    const metrics = estimatePageCount(result.resumeData);

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ Resume Generation Complete');
    console.log(`   Final Pages: ${result.estimatedPages.toFixed(2)}`);
    console.log(`   Iterations: ${result.iterations}`);
    console.log(`   Bullets Removed: ${result.removedBullets.length}`);
    console.log(`${'='.repeat(60)}\n`);

    return {
      resumeData: result.resumeData,
      metrics,
      removedItems: result.removedBullets.map(b => ({
        type: b.type,
        item: { text: b.bulletText, title: b.itemTitle },
        score: b.score,
        reasoning: `Bullet from ${b.itemTitle}`
      }))
    };
  }

  // Otherwise, return top-scored items without trimming
  console.log('\n📄 Selecting top-scored items (no page limit)');
  const resumeData = selectTopScoredItems(scoredData);
  const metrics = estimatePageCount(resumeData);

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Resume Generation Complete');
  console.log(`   Estimated Pages: ${metrics.estimatedPages.toFixed(2)}`);
  console.log(`${'='.repeat(60)}\n`);

  return {
    resumeData,
    metrics,
    removedItems: []
  };
}
