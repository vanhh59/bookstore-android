import express from "express";
const router = express.Router();

import {
    addOrderItem,
    getOrderItem,
    getOrderItemByUserID,
} from "../controllers/orderItemController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: API for managing order items
 */

/**
 * @swagger
 * /api/order-items:
 *   post:
 *     tags: [OrderItems]
 *     summary: Add a new order item
 *     description: Creates a new order item based on the provided product ID and quantity.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                type: string
 *               description: ID of the user
 *               example: "67127cb5f90d16421311e78b"  # Example user ID
 *               product:
 *                 type: string
 *                 description: ID of the product to add
 *                 example: "6714707e7bf445c8a1c40d94"  # Example product ID
 *               qty:
 *                 type: integer
 *                 description: Quantity of the product
 *                 example: 2  # Example quantity
 *           example:  # Added this for your specific JSON example
 *             product: "67127cb5f90d16421311e78b" 
 *             qty: 2
 *     responses:
 *       201:
 *         description: Order item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order item created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67127cb5f90d16421311e78b"
 *                     name:
 *                       type: string
 *                       example: "Product Name"
 *                     qty:
 *                       type: integer
 *                       example: 2
 *                     image:
 *                       type: string
 *                       example: "http://example.com/image.jpg"
 *                     price:
 *                       type: number
 *                       example: 100.0
 *                     product:
 *                       type: string
 *                       example: "60f4f4f4f4f4f4f4f4f4f4"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/order-items:
 *   get:
 *     tags: [OrderItems]
 *     summary: Retrieve all order items
 *     description: Returns a list of all order items.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "67127cb5f90d16421311e78b"
 *                   name:
 *                     type: string
 *                     example: "Product Name"
 *                   qty:
 *                     type: integer
 *                     example: 2
 *                   image:
 *                     type: string
 *                     example: "http://example.com/image.jpg"
 *                   price:
 *                     type: number
 *                     example: 100.0
 *                   product:
 *                     type: string
 *                     example: "60f4f4f4f4f4f4f4f4f4f4"
 *       401:
 *         description: Unauthorized access
 */

router
    .route("/")
    .post(addOrderItem)
    .get(getOrderItem);
router
    .route("/:id")
    .get(getOrderItemByUserID);

export default router;
