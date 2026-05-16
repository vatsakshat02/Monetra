import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import User from "../models/User";
import Loan from "../models/Loan";

const calculateAge = (dateofBirth: Date): number => {
  const today = new Date();
  const birth = new Date(dateofBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const runBRE = (
  age: number,
  monthlySalary: number,
  pan: string,
  employmentMode: string
): { passed: boolean; reason?: string } => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (age < 23 || age > 50) {
    return { passed: false, reason: "Age must be between 23 and 50 years" };
  }

  if (monthlySalary < 25000) {
    return { passed: false, reason: "Monthly salary must be 25,000" };
  }

  if (!panRegex.test(pan)) {
    return {
      passed: false,
      reason: "Invalid Pan format. Must be like ABCDE1234F",
    };
  }

  if (employmentMode === "unemployed") {
    return {
      passed: false,
      reason: "Unemployed applicants are not eligible ",
    };
  }

  return { passed: true };
};

export const saveProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { pan, dateOfBirth, monthlySalary, employmentMode } = req.body;

    const age = calculateAge(new Date(dateOfBirth));

    const breResult = runBRE(
      age,
      monthlySalary,
      pan.toUpperCase(),
      employmentMode
    );

    if (!breResult.passed) {
      res.status(400).json({
        message: "Eligibility check failed",
        reason: breResult.reason,
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        pan: pan.toUpperCase(),
        dateOfBirth: new Date(dateOfBirth),
        monthlySalary,
        employmentMode,
        isProfileComplete: true,
      },
      { new: true }
    );

    res.status(200).json({
      message: "profile saved successfully",
      user: {
        id: user?._id,
        name: user?.name,
        isProfileComplete: user?.isProfileComplete,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const uploadSalarySlip = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;

    await Loan.findOneAndUpdate(
      { borrowerId: req.user?.id },
      { salarySlipUrl: fileUrl }
    );

    res.status(200).json({
      message: "Salary slip uploaded successfully",
      fileUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const applyLoan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, tenure } = req.body;
    const user = await User.findById(req.user?.id);
    if (!user?.isProfileComplete) {
      res
        .status(400)
        .json({ message: "Complete your profile before applying" });
      return;
    }
    const existingLoan = await Loan.findOne({
      borrowerId: req.user?.id,
      status: { $in: ["APPLIED", "SANCTIONED", "DISBURSED"] },
    });
    if (existingLoan) {
      res.status(400).json({ message: "You have an active loan application" });
      return;
    }
    const rate = 12;
    const si = (amount * rate * tenure) / (365 * 100);
    const totalRepayment = Math.round(amount + si);

    const loan = await Loan.create({
      borrowerId: req.user?.id,
      amount,
      tenure,
      interestRate: rate,
      totalRepayment,
      status: "APPLIED",
    });

    res.status(200).json({
      message: "Loan submitted successfully",
      loan: {
        id: loan._id,
        amount: loan.amount,
        tenure: loan.tenure,
        interestRate: loan.interestRate,
        totalRepayment: loan.totalRepayment,
        status: loan.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyLoan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loan = await Loan.findOne({ borrowerId: req.user?.id }).sort({
      createdAt: -1,
    });
    console.log("Found loan:", loan);
    if (!loan) {
      res.status(404).json({ message: "No loan found" });
      return;
    }

    res.status(200).json({ loan });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
