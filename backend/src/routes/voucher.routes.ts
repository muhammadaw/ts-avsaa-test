import { Router } from "express";
import { checkVoucherController, generateVoucherController } from "../controllers/voucher.controller";

const router = Router();

router.post("/check", checkVoucherController);
router.post("/generate", generateVoucherController);

export default router;
