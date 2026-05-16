import { Router } from "express";
import {
  getSalesData,
  getCollectionData,
  getDisbursementData,
  getSanctionedData,
  approveLoan,
  rejectLoan,
  disburseLoan,
  recordPayment,
} from "../controllers/dashboard.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
console.log("Dashboard routes loaded");

const router = Router();

router.get("/sales", authenticate, authorize("sales", "admin"), getSalesData);

router.get(
  "/sanction",
  authenticate,
  authorize("sanction", "admin"),
  getSanctionedData
);
router.patch(
  "/sanction/:loanId/approve",
  authenticate,
  authorize("sanction", "admin"),
  approveLoan
);
router.patch(
  "/sanction/:loanId/reject",
  authenticate,
  authorize("sanction", "admin"),
  rejectLoan
);

router.get(
  "/disbursement",
  authenticate,
  authorize("disbursement", "admin"),
  getDisbursementData
);
router.patch(
  "/disbursement/:loanId/disburse",
  authenticate,
  authorize("disbursement", "admin"),
  disburseLoan
);

router.get(
  "/collection",
  authenticate,
  authorize("collection", "admin"),
  getCollectionData
);
router.post(
  "/collection/:loanId/payment",
  authenticate,
  authorize("collection", "admin"),
  recordPayment
);
export default router;
