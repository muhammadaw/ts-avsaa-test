import { Router } from "express";
import { checkVoucherController, generateVoucherController, getHistoryController } from "../controllers/voucher.controller";

const router = Router();

router.post("/check", checkVoucherController);
router.post("/generate", generateVoucherController);
router.get("/history", getHistoryController);

export default router;
