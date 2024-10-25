import express from "express";
const router = express.Router();

import {
    addOrderItem,
    getOrderItem,
    getOrderItemByUserID,
    deleteOrderItem,
    updateOrderItem,
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
 *       - bearerAuth: []  # Indicates that this endpoint requires bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID of the user
 *                 example: "67127cb5f90d16421311e78b"  # Example user ID
 *               product:
 *                 type: string
 *                 description: ID of the product to add
 *                 example: "6714707e7bf445c8a1c40d94"  # Example product ID
 *               qty:
 *                 type: integer
 *                 description: Quantity of the product
 *                 example: 2  # Example quantity
 *           example:  # Example request body
 *             user: "671b1b011c1adb725fe5420d"
 *             product: "671778e825d6cf6d6afe0703" 
 *             qty: 1
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
 *                       format: float  # Added format for clarity
 *                       example: 100.0
 *                     product:
 *                       type: string
 *                       example: "60f4f4f4f4f4f4f4f4f4f4"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not found"
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

/**
 * @swagger
 * /api/order-items/{id}:
 *   delete:
 *     tags: [OrderItems]
 *     summary: Delete an order item
 *     description: Deletes an order item by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order item deleted successfully
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
 *                   example: "Order item deleted successfully"
 *       404:
 *         description: Order item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order item not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */    
router.route("/:id").delete(deleteOrderItem);    

router.route("/:id").put(updateOrderItem);

export default router;
