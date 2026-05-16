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

export const getDisbursementData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loans = await Loan.find({ status: "SANCTIONED" }).populate(
      "borrowerId",
      "-password"
    );
    res.status(200).json({ loans });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const disburseLoan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) {
      res.status(404).json({ message: "Loan Not found" });
      return;
    }

    if (loan.status !== "SANCTIONED") {
      res
        .status(400)
        .json({ message: "Only sanctioned loan can be dispursed" });
      return;
    }

    loan.status = "DISBURSED";
    loan.disbursedBy = req.user?.id as any;
    await loan.save();
    res.status(200).json({ message: "Loan disbursed successfully", loan });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCollectionData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loans = await Loan.find({ status: "DISBURSED" }).populate(
      "borrowerId",
      "-password"
    );
    res.status(200).json({ loans });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const recordPayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { utrNumber, amount, paymentDate } = req.body;
    console.log("Payment body:", req.body);

    const loan = await Loan.findById(req.params.loanId);
    console.log("Found loan:", loan?.status);
    if (!loan) {
      res.status(404).json({ message: "Loan not found" });
      return;
    }
    if (loan.status !== "DISBURSED") {
      res
        .status(400)
        .json({ message: "Payment can be recorded for only disbursed loans" });
      return;
    }

    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      res.status(400).json({ mesage: "UTR number already exists" });
      return;
    }

    const payments = await Payment.find({ loanId: loan._id });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    console.log("Total paid:", totalPaid);
    console.log("Remaining:", loan.totalRepayment - totalPaid);
    console.log("Amount being paid:", amount);

    const remaining = loan.totalRepayment - totalPaid;
    if (amount > remaining) {
      res.status(400).json({
        message: `Amount exceeds outstanding balance, Remaining ${remaining}`,
      });
      return;
    }
    const payment = await Payment.create({
      loanId: loan._id,
      utrNumber,
      amount,
      paymentDate,
      recordedBy: req.user?.id,
    });

    const newTotalPaid = totalPaid + amount;
    if (newTotalPaid >= loan.totalRepayment) {
      loan.status = "CLOSED";
      await loan.save();
    }

    res.status(200).json({
      message:
        newTotalPaid >= loan.totalRepayment
          ? "Loan is closed now"
          : "Payment recorded sucessfully",
      payment,
      totalPaid: newTotalPaid,
      remaining: loan.totalRepayment - newTotalPaid,
      loanStatus: loan.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
