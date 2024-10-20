import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  filterProductsByName
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";


/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add a new product
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: test3
 *               brand:
 *                 type: string
 *                 description: Brand of the product
 *                 example: vendo
 *               description:
 *                 type: string
 *                 description: Description of the product
 *                 example: test1
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 100
 *               category:
 *                 type: string
 *                 description: Category ID of the product
 *                 example: 670172c4a884b2a83eb03d30
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product in stock
 *                 example: 18
 *               image:
 *                 type: string
 *                 example: Url
 *                 description: Image file for the product
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad Request - Missing required fields or validation error
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal Server Error - Failed to create product
 */
router.route("/").post(formidable(), addProduct);

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Fetch all products with optional filters
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filter products by category ID
 *         required: false
 *         schema:
 *           type: string
 *       - name: brand
 *         in: query
 *         description: Filter products by brand name
 *         required: false
 *         schema:
 *           type: string
 *       - name: minPrice
 *         in: query
 *         description: Minimum price filter
 *         required: false
 *         schema:
 *           type: number
 *       - name: maxPrice
 *         in: query
 *         description: Maximum price filter
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the product
 *                   name:
 *                     type: string
 *                     description: The name of the product
 *                   brand:
 *                     type: string
 *                     description: The brand of the product
 *                   price:
 *                     type: number
 *                     description: The price of the product
 *                   category:
 *                     type: string
 *                     description: The category ID of the product
 *                   quantity:
 *                     type: number
 *                     description: The available quantity of the product
 *                   image:
 *                     type: string
 *                     description: The URL of the product image
 *       500:
 *         description: Server error
 */
router.route("/").get(fetchProducts);

/**
 * @openapi
 * /api/products/allproducts:
 *  get:
 *    tags:
 *    - Products
 *    summary: Fetch all products without filters
 *    responses:
 *      200:
 *        description: All products retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  brand:
 *                    type: string
 *                  price:
 *                    type: number
 *                  category:
 *                    type: string
 *                  quantity:
 *                    type: number
 *                  description:
 *                    type: string
 *                  image:
 *                    type: string
 *      500:
 *        description: Server error
 */
router.route("/allproducts").get(fetchAllProducts);

/**
 * @openapi
 * /api/products/{id}/reviews:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add a review for a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to review
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user submitting the review
 *               rating:
 *                 type: number
 *                 description: Rating of the product (1 to 5)
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
//router.route("/:id/reviews").post(checkId, addProductReview);
router.route("/:id/reviews").post(checkId, addProductReview);

/**
 * @openapi
 * /api/products/top:
 *   get:
 *     tags:
 *       - Products
 *     summary: Fetch top-rated products
 *     responses:
 *       200:
 *         description: Successfully retrieved top-rated products
 *       500:
 *         description: Server error
 */
router.get("/top", fetchTopProducts);

/**
 * @openapi
 * /api/products/new:
 *   get:
 *     tags:
 *       - Products
 *     summary: Fetch newly added products
 *     responses:
 *       200:
 *         description: Successfully retrieved newly added products
 *       500:
 *         description: Server error
 */
router.get("/new", fetchNewProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a product by ID (admin access required)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update a product by ID (admin access required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a product by ID (admin access required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id")
  .get(fetchProductById)
  .put(updateProductDetails)
  .delete(removeProduct);

/**
 * @openapi
 * /api/products/filtered-products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Filter products based on specific criteria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               criteria:
 *                 type: object
 *                 description: Filtering criteria
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered products
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.route("/filtered-products").post(filterProducts);

router.route("/filtered-products-name").post(filterProductsByName);

export default router;