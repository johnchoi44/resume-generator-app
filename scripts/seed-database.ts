/**
 * Database Seeding Script
 * Populates MongoDB with John Choi's resume data
 *
 * Usage: npx tsx scripts/seed-database.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { skillsData, experiencesData, projectsData } from './seed-data';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import models
import Skill from '../lib/db/models/Skill';
import Experience from '../lib/db/models/Experience';
import Project from '../lib/db/models/Project';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local');
  console.log('Please add your MongoDB connection string to .env.local');
  console.log('Example: MONGODB_URI=mongodb://localhost:27017/resume-generator');
  process.exit(1);
}

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Project.deleteMany({});
    console.log('✓ Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function seedSkills() {
  try {
    const skills = await Skill.insertMany(skillsData);
    console.log(`✓ Seeded ${skills.length} skill categories`);
    return skills;
  } catch (error) {
    console.error('❌ Error seeding skills:', error);
    throw error;
  }
}

async function seedExperiences() {
  try {
    const experiences = await Experience.insertMany(experiencesData);
    console.log(`✓ Seeded ${experiences.length} experiences`);
    return experiences;
  } catch (error) {
    console.error('❌ Error seeding experiences:', error);
    throw error;
  }
}

async function seedProjects() {
  try {
    const projects = await Project.insertMany(projectsData);
    console.log(`✓ Seeded ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    throw error;
  }
}

async function printSummary() {
  const skillCount = await Skill.countDocuments();
  const expCount = await Experience.countDocuments();
  const projCount = await Project.countDocuments();

  console.log('\n📊 Database Summary:');
  console.log(`   Skills: ${skillCount} categories`);
  console.log(`   Experiences: ${expCount} positions`);
  console.log(`   Projects: ${projCount} projects`);
  console.log('\n✨ Database seeding completed successfully!\n');
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Connect to database
    await connectToDatabase();

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await clearDatabase();

    // Seed data
    console.log('\n📝 Seeding data...');
    await seedSkills();
    await seedExperiences();
    await seedProjects();

    // Print summary
    await printSummary();

    // Close connection
    await mongoose.connection.close();
    console.log('✓ Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seeding script
main();
