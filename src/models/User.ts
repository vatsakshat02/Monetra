import mongoose, { Document, Schema } from "mongoose";

export type userRole =
  | "borrower"
  | "admin"
  | "sales"
  | "sanction"
  | "disbursement"
  | "collection";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: userRole;
  pan?: string;
  dateOfBirth?: Date;
  monthlySalary?: number;
  employmentMode?: "salaried" | "self-employed" | "unemployed";
  isProfileComplete: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "borrower",
        "admin",
        "sales",
        "sanction",
        "disbursement",
        "collection",
      ],
      default: "borrower",
    },
    pan: {
      type: String,
      uppercase: true,
    },
    dateOfBirth: {
      type: Date,
    },
    monthlySalary: {
      type: Number,
    },
    employmentMode: {
      type: String,
      enum: ["salaried", "self-employed", "unemployed"],
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
