import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import User from "../models/User";
import Loan from "../models/Loan";
import Payment from "../models/Payment";
import authorize from "../middleware/authorize";

export const getSalesData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({
      role: "borrower",
      isProfileComplete: false,
    }).select("-password");

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ mesage: "Server Error" });
  }
};

export const getSanctionedData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loans = await Loan.find({ status: "APPLIED" }).populate(
      "borrowerId",
      "-password"
    );
    res.status(200).json({ loans });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const approveLoan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) {
      res.status(404).json({ message: "Loan not found" });
      return;
    }

    if (loan.status !== "APPLIED") {
      res.status(404).json({ mesage: "Only applied loans can be sanctioned" });
      return;
    }

    loan.status = "SANCTIONED";
    loan.sanctionedBy = req.user?.id as any;
    await loan.save();

    res.status(200).json({ message: "Loan sanctioned successfully", loan });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const rejectLoan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { reason } = req.body;
    if (!reason) {
      res.status(400).json({ message: "Rejection reason is required" });
      return;
    }

    const loan = await Loan.findById(req.params.loanId);
    if (!loan) {
      res.status(400).json({ message: "No loan found" });
      return;
    }

    if (loan.status !== "APPLIED") {
      res.status(400).json({ message: "Only applied loans can be rejected" });
      return;
    }

    loan.status = "REJECTED";
    loan.rejectionReason = reason;
    await loan.save();

    res.status(200).json({ message: "Loan rejected", loan });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
