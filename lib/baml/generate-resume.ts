import { b } from '@/baml_client';
import { Collector } from '@boundaryml/baml';
import type {
  ResumeData,
  MasterExperienceData,
  UserResumeRequest,
} from '@/baml_client/types';

export interface GenerateResumeOptions {
  keywords?: string[];
  jobDescription?: string;
  targetRole?: string;
}

export interface DebugInfo {
  prompt?: any;
  rawResponse?: string | null;
  response?: any;
  usage?: {
    inputTokens?: number | null;
    outputTokens?: number | null;
  } | null;
}

export interface GenerateResumeResult {
  resumeData: ResumeData;
  debug?: DebugInfo;
}

/**
 * Generate a customized resume using BAML AI
 * Falls back to keyword-based filtering if BAML fails
 */
export async function generateCustomizedResume(
  request: GenerateResumeOptions,
  masterData: MasterExperienceData
): Promise<GenerateResumeResult> {
  try {
    // Convert to BAML request format
    const bamlRequest: UserResumeRequest = {
      keywords: request.keywords || null,
      job_description: request.jobDescription || null,
      target_role: request.targetRole || null,
    };

    console.log('🤖 Calling BAML to generate resume...');

    // Create collector to capture raw HTTP request/response
    const collector = new Collector("resume-generator");

    // Call BAML function with collector
    const resumeData = await b.GenerateCustomizedResume(bamlRequest, masterData, { collector });

    console.log('✓ BAML generation successful');

    // Extract debug info from collector
    const lastCall = collector.last?.calls?.slice(-1)[0];
    const debug: DebugInfo = {
      prompt: lastCall?.httpRequest?.body?.json(),
      rawResponse: collector.last?.rawLlmResponse,
      response: lastCall?.httpResponse?.body?.json(),
      usage: collector.last?.usage ? {
        inputTokens: collector.last.usage.inputTokens,
        outputTokens: collector.last.usage.outputTokens,
      } : null,
    };

    // BAML automatically validates against the ResumeData schema
    // If validation fails, it throws a type error
    return { resumeData, debug };

  } catch (error) {
    console.error('BAML generation failed, using fallback:', error);

    // Fallback: Return filtered master data based on keywords
    return { resumeData: fallbackResumeGeneration(request, masterData) };
  }
}

/**
 * Fallback resume generation using simple keyword matching
 * Used when BAML fails or API is unavailable
 */
function fallbackResumeGeneration(
  request: GenerateResumeOptions,
  masterData: MasterExperienceData
): ResumeData {
  console.log('📋 Using fallback keyword-based filtering');

  const keywords = (request.keywords || []).map(k => k.toLowerCase());

  // If no keywords provided, return a reasonable default
  if (keywords.length === 0) {
    return {
      skills: masterData.all_skills.slice(0, 6),
      experiences: masterData.all_experiences.slice(0, 3),
      projects: masterData.all_projects.slice(0, 2),
    };
  }

  // Filter experiences by keywords in description, position, or company
  const filteredExperiences = masterData.all_experiences.filter(exp => {
    const text = `${exp.position} ${exp.company} ${exp.description.join(' ')}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }).slice(0, 3);

  // Filter projects by keywords in name or description
  const filteredProjects = masterData.all_projects.filter(proj => {
    const text = `${proj.name} ${proj.description.join(' ')}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }).slice(0, 2);

  // Reorder skills by relevance (if skill items contain keywords)
  const scoredSkills = masterData.all_skills.map(skill => {
    const text = `${skill.category} ${skill.items.join(' ')}`.toLowerCase();
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    return { skill, score: matches };
  });

  scoredSkills.sort((a, b) => b.score - a.score);
  const orderedSkills = scoredSkills.map(s => s.skill);

  return {
    skills: orderedSkills,
    experiences: filteredExperiences.length > 0
      ? filteredExperiences
      : masterData.all_experiences.slice(0, 2),
    projects: filteredProjects.length > 0
      ? filteredProjects
      : masterData.all_projects.slice(0, 2),
  };
}
