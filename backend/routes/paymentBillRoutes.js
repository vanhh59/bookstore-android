/**
 * @openapi
 * tags:
 *   name: Payment Bills
 *   description: API endpoints for managing payment bills
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     PaymentBill:
 *       type: object
 *       required:
 *         - senderName
 *         - senderBank
 *         - senderAccount
 *         - receiverName
 *         - receiverBank
 *         - receiverAccount
 *         - date
 *         - amount
 *       properties:
 *         senderName:
 *           type: string
 *           example: John Doe
 *         senderBank:
 *           type: string
 *           example: ABC Bank
 *         senderAccount:
 *           type: string
 *           example: 1234567890
 *         receiverName:
 *           type: string
 *           example: Jane Smith
 *         receiverBank:
 *           type: string
 *           example: XYZ Bank
 *         receiverAccount:
 *           type: string
 *           example: 0987654321
 *         date:
 *           type: string
 *           example: 2024-10-17
 *         amount:
 *           type: string
 *           example: 1000.00
 */

/**
 * @openapi
 * '/api/payment-bills':
 *  post:
 *    tags:
 *      - Payment Bills
 *    summary: Create a new payment bill
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PaymentBill'
 *    responses:
 *      201:
 *        description: Payment bill created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                senderName:
 *                  type: string
 *                senderBank:
 *                  type: string
 *                senderAccount:
 *                  type: string
 *                receiverName:
 *                  type: string
 *                receiverBank:
 *                  type: string
 *                receiverAccount:
 *                  type: string
 *                date:
 *                  type: string
 *                amount:
 *                  type: string
 *      500:
 *        description: Server error
 */

/**
 * @openapi
 * '/api/payment-bills':
 *  get:
 *    tags:
 *      - Payment Bills
 *    summary: Retrieve all payment bills
 *    responses:
 *      200:
 *        description: List of payment bills
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PaymentBill'
 *      500:
 *        description: Server error
 */

/**
 * @openapi
 * '/api/payment-bills/{id}':
 *  get:
 *    tags:
 *      - Payment Bills
 *    summary: Get a payment bill by its ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The payment bill ID
 *    responses:
 *      200:
 *        description: Payment bill details
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PaymentBill'
 *      404:
 *        description: Payment bill not found
 *      500:
 *        description: Server error
 */


import express from "express";

const router = express.Router();

import { addPaymentBill, getPaymentBillsAll, getPaymentBillById } from "../controllers/paymentBillController.js";

router.route("/").post(addPaymentBill);
router.route("/").get(getPaymentBillsAll);
router.route("/:id").get(getPaymentBillById);

export default router;
