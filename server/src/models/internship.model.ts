import { Schema, model, type Types } from "mongoose";

export interface IInternship {
  _id: Types.ObjectId;
  title: string;
  company: string;
  description: string | null;
  requiredSkills: string[];
  preferredSkills: string[];
  applyUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const internshipSchema = new Schema<IInternship>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    applyUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as { __v?: unknown }).__v;
        return ret;
      },
    },
  },
);

internshipSchema.index({ requiredSkills: 1 });
internshipSchema.index({ preferredSkills: 1 });

export const Internship = model<IInternship>("Internship", internshipSchema);
