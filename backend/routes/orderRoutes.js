import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  getCartItems,
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates an order with specified items and shipping details.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: "Enter the product ID"
 *                     qty:
 *                       type: integer
 *                       description: "Enter the quantity of the product"
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: "Name of the recipient"
 *                   address:
 *                     type: string
 *                     description: "Shipping address"
 *                   city:
 *                     type: string
 *                     description: "City of the shipping address"
 *                   postalCode:
 *                     type: string
 *                     description: "Postal code of the shipping address"
 *                   country:
 *                     type: string
 *                     description: "Country of the shipping address"
 *                   phoneNumber:
 *                     type: string
 *                     description: "Phone number of the recipient"
 *               paymentMethod:
 *                 type: string
 *                 description: "Method of payment"
 *               paymentBill:
 *                 type: string
 *                 description: "ID of the payment bill"
 *             example:
 *               orderItems: 
 *                 - _id: "67127cb5f90d16421311e78b"
 *                   qty: 2
 *                 - _id: "67147721c8d069352559be03"
 *                   qty: 1
 *               shippingAddress: 
 *                 name: "Viet Anh"
 *                 address: "120 La Xuan Oai Thu Duc"
 *                 city: "HCM"
 *                 postalCode: "70000"
 *                 country: "VN"
 *                 phoneNumber: "0123456789"
 *               paymentMethod: "Momo"
 *               paymentBill: "671223827478771599feaead"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request, no order items
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders
 *     description: Fetch all orders from the system. Only admins can access this route.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   orderItems:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product:
 *                           type: string
 *                         qty:
 *                           type: integer
 *                         price:
 *                           type: number
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                   shippingAddress:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *                       country:
 *                         type: string
 *                   paymentMethod:
 *                     type: string
 *                   itemsPrice:
 *                     type: number
 *                   taxPrice:
 *                     type: number
 *                   shippingPrice:
 *                     type: number
 *                   totalPrice:
 *                     type: number
 *                   isPaid:
 *                     type: boolean
 *                   paidAt:
 *                     type: string
 *                   isDelivered:
 *                     type: boolean
 *                   deliveredAt:
 *                     type: string
 *       401:
 *         description: Unauthorized, admin access required
 *       500:
 *         description: Internal server error
 */

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, getAllOrders);

/**
 * @swagger
 * /api/orders/mine:
 *   get:
 *     summary: Get current user's orders
 *     description: Fetches all orders for the authenticated user.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.route("/mine").get(authenticate, getUserOrders);

/**
 * @swagger
 * /api/orders/total-orders:
 *   get:
 *     summary: Count total orders
 *     description: Returns the total number of orders in the system.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total number of orders
 *       500:
 *         description: Internal server error
 */
router.route("/total-orders").get(countTotalOrders);

/**
 * @swagger
 * /api/orders/total-sales:
 *   get:
 *     summary: Calculate total sales
 *     description: Returns the total sales amount for all orders.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total sales amount
 *       500:
 *         description: Internal server error
 */
router.route("/total-sales").get(calculateTotalSales);

/**
 * @swagger
 * /api/orders/total-sales-by-date:
 *   get:
 *     summary: Calculate total sales by date
 *     description: Returns total sales grouped by date.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total sales by date
 *       500:
 *         description: Internal server error
 */
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieves the details of a specific order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id").get(authenticate, findOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Mark order as paid
 *     description: Updates the order status to paid.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to mark as paid
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *               update_time:
 *                 type: string
 *               payer:
 *                 type: object
 *                 properties:
 *                   email_address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Order marked as paid successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id/pay").put(authenticate, markOrderAsPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Mark order as delivered
 *     description: Updates the order status to delivered.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to mark as delivered
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as delivered successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/:id/deliver")
  .put(authenticate, markOrderAsDelivered);

// Router get OrderItems
router
  .route("/cart-items")
  .get(authenticate, getCartItems);



export default router;
