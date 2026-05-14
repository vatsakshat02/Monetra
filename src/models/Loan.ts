import mongoose, { Document, Schema } from "mongoose";

export type loanStatus =
  | "APPLIED"
  | "SANCTIONED"
  | "DISBURSED"
  | "CLOSED"
  | "REJECTED";

export interface Iloan extends Document {
  borrowerId: mongoose.Types.ObjectId;
  amount: number;
  tenure: number;
  interestRate: number;
  totalRepayment: number;
  status: loanStatus;
  salarySlipUrl?: string;
  rejectionReason: String;
  sanctionedBy?: mongoose.Types.ObjectId;
  disbursedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<Iloan>(
  {
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 50000,
      max: 500000,
    },
    tenure: {
      type: Number,
      required: true,
      min: 30,
      max: 365,
    },
    interestRate: {
      type: Number,
      default: 12,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["APPLIED", "SANCTIONED", "DISBURSED", "CLOSED", "REJECTED"],
      default: "APPLIED",
    },
    salarySlipUrl: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    sanctionedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    disbursedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<Iloan>("Loan", LoanSchema);
