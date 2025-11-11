import mongoose, { Schema, model, models } from 'mongoose';

export interface IProject {
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
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    position: {
      type: String,
      trim: true,
      default: '',
    },
    date_from: {
      type: String,
      required: [true, 'Start date is required'],
    },
    date_to: {
      type: String,
      required: [true, 'End date is required'],
    },
    description: {
      type: [String],
      required: [true, 'Description is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'At least one description bullet point is required',
      },
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    demoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ProjectSchema.index({ technologies: 1 });
ProjectSchema.index({ isActive: 1, displayOrder: 1 });
ProjectSchema.index({ description: 'text', name: 'text' });

const Project = models.Project || model<IProject>('Project', ProjectSchema);

export default Project;
