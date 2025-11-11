import mongoose, { Schema, model, models } from 'mongoose';

export interface ISkill {
  category: string;
  items: string[];
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      unique: true,
      trim: true,
    },
    items: {
      type: [String],
      required: [true, 'Items are required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'At least one skill item is required',
      },
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

// Index for efficient queries
SkillSchema.index({ displayOrder: 1 });

const Skill = models.Skill || model<ISkill>('Skill', SkillSchema);

export default Skill;
