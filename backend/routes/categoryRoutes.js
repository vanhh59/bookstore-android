import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *                 example: Electronics
 *                 maxLength: 32
 *                 unique: true
 *                 required: true
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error (e.g., missing or invalid data)
 */

router.route("/").post(createCategory);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   put:
 *     summary: Update a category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category updated
 */
router.route("/:categoryId").put(updateCategory);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   delete:
 *     summary: Remove a category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category removed
 */
router.route("/:categoryId").delete(removeCategory);

/**
 * @swagger
 * /api/category/categories:
 *   get:
 *     summary: Get list of categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.route("/categories").get(listCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get a specific category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category details
 */
router.route("/:id").get(readCategory);

export default router;

