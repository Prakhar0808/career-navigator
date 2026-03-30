import { Schema, model, type Types } from "mongoose";

// ── Interface
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string | null; // null for OAuth users
  role: "student" | "mentor" | "recruiter";
  avatar: string | null;
  provider: "local" | "google" | "github";
  providerId: string | null;

  // Student-specific
  phone: string | null;
  skills: string[];

  // Mentor-specific
  expertise: string[];
  bio: string | null;

  // Recruiter-specific
  companyName: string | null;
  companyEmail: string | null;

  profileCompletion: number;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ───
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["student", "mentor", "recruiter"],
      required: true,
    },
    avatar: {
      type: String,
      default: null, // Cloudinary URL
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: {
      type: String,
      default: null,
    },

    // ── Student Fields ──
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },

    // ── Mentor Fields ──
    expertise: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: null,
      maxlength: 500,
    },

    // ── Recruiter Fields ──
    companyName: {
      type: String,
      default: null,
      trim: true,
    },
    companyEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    // ── Common ──
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginIp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Partial<IUser & { __v: unknown }>).password;
        delete (ret as Partial<IUser & { __v: unknown }>).__v;
        return ret;
      },
    },
  },
);

// ── Indexes ───
userSchema.index({ role: 1 });
userSchema.index({ provider: 1, providerId: 1 });

export const User = model<IUser>("User", userSchema);
