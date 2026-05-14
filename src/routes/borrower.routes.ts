import { Router } from "express";
import { saveProfile } from "../controllers/borrower.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = Router();

router.post("/profile", authenticate, authorize("borrower"), saveProfile);

export default router;
