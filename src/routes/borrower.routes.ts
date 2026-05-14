import { Router } from "express";
import {
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

export default router;
