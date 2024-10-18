import express from "express";

const router = express.Router();

import { addPaymentBill, getPaymentBillsAll, getPaymentBillById } from "../controllers/paymentBillController.js";

router.route("/").post(addPaymentBill);
router.route("/").get(getPaymentBillsAll);
router.route("/:id").get(getPaymentBillById);

export default router;
