import connectDB from './mongoose';
import Experience, { IExperience } from './models/Experience';
import Skill, { ISkill } from './models/Skill';
import Project, { IProject } from './models/Project';

// Clean types without MongoDB metadata for BAML
export interface CleanSkill {
  category: string;
  items: string[];
  displayOrder: number;
}

export interface CleanExperience {
  position: string;
  company: string;
  location: string;
  date_from: string;
  date_to: string;
  description: string[];
  tags: string[];
  isActive: boolean;
  displayOrder: number;
}

export interface CleanProject {
  name: string;
  position?: string;
  date_from: string;
  date_to: string;
  description: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface MasterExperienceData {
  all_experiences: CleanExperience[];
  all_skills: CleanSkill[];
  all_projects: CleanProject[];
}

/**
 * Strip MongoDB metadata (_id, createdAt, updatedAt, __v) from documents
 */
function stripMongoMetadata<T>(doc: any): T {
  const { _id, createdAt, updatedAt, __v, ...clean } = doc;
  return clean as T;
}

/**
 * Fetches all resume data from MongoDB
 * This is used as input to the BAML function
 */
export async function getMasterExperienceData(): Promise<MasterExperienceData> {
  await connectDB();

  const [experiences, skills, projects] = await Promise.all([
    Experience.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
    Skill.find().sort({ displayOrder: 1 }).lean(),
    Project.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
  ]);

  // Strip MongoDB metadata before returning
  return {
    all_experiences: experiences.map(exp => stripMongoMetadata<CleanExperience>(exp)),
    all_skills: skills.map(skill => stripMongoMetadata<CleanSkill>(skill)),
    all_projects: projects.map(proj => stripMongoMetadata<CleanProject>(proj)),
  };
}

/**
 * Fetches experiences matching specific keywords
 */
export async function getExperiencesByKeywords(keywords: string[]): Promise<IExperience[]> {
  await connectDB();

  const lowerKeywords = keywords.map(k => k.toLowerCase());

  const experiences = await Experience.find({
    isActive: true,
    $or: [
      { tags: { $in: lowerKeywords } },
      { $text: { $search: keywords.join(' ') } }
    ]
  }).sort({ displayOrder: 1 }).lean();

  return experiences as IExperience[];
}

/**
 * Fetches projects matching specific technologies
 */
export async function getProjectsByTechnologies(technologies: string[]): Promise<IProject[]> {
  await connectDB();

  const lowerTech = technologies.map(t => t.toLowerCase());

  const projects = await Project.find({
    isActive: true,
    $or: [
      { technologies: { $in: lowerTech } },
      { $text: { $search: technologies.join(' ') } }
    ]
  }).sort({ displayOrder: 1 }).lean();

  return projects as IProject[];
}

/**
 * Gets all active experiences
 */
export async function getAllExperiences(): Promise<IExperience[]> {
  await connectDB();
  const experiences = await Experience.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
  return experiences as IExperience[];
}

/**
 * Gets all skills
 */
export async function getAllSkills(): Promise<ISkill[]> {
  await connectDB();
  const skills = await Skill.find().sort({ displayOrder: 1 }).lean();
  return skills as ISkill[];
}

/**
 * Gets all active projects
 */
export async function getAllProjects(): Promise<IProject[]> {
  await connectDB();
  const projects = await Project.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
  return projects as IProject[];
}
