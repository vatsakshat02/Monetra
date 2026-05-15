import { Router } from "express";
import {
  applyLoan,
  getMyLoan,
  saveProfile,
  uploadSalarySlip,
} from "../controllers/borrower.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import upload from "../config/multer";

const router = Router();

router.post("/profile", authenticate, authorize("borrower"), saveProfile);
router.post(
  "/upload",
  authenticate,
  authorize("borrower"),
  upload.single("salarySlip"),
  uploadSalarySlip
);
router.post("/apply", authenticate, authorize("borrower"), applyLoan);
router.post("/loan", authenticate, authorize("borrower"), getMyLoan);

export default router;
