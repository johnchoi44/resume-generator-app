import mongoose, { Schema, model, models } from 'mongoose';

export interface IExperience {
  position: string;
  company: string;
  location: string;
  date_from: string;
  date_to: string;
  description: string[];
  tags: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
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
    tags: {
      type: [String],
      default: [],
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
ExperienceSchema.index({ tags: 1 });
ExperienceSchema.index({ isActive: 1, displayOrder: 1 });
ExperienceSchema.index({ description: 'text', position: 'text', company: 'text' });

const Experience = models.Experience || model<IExperience>('Experience', ExperienceSchema);

export default Experience;
