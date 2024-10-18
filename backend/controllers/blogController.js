import Blog from "../models/blogModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created blog
 *       400:
 *         description: Invalid input
 */
const createBlog = asyncHandler(async (req, res) => {
    const { title, content, imageUrl } = req.body;

    if (!title || !content || !imageUrl) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const blog = await new Blog({ title, content, imageUrl }).save();
    res.status(201).json(blog);
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated blog
 *       404:
 *         description: Blog not found
 */
const updateBlog = asyncHandler(async (req, res) => {
    const { title, content, imageUrl } = req.body;
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.imageUrl = imageUrl || blog.imageUrl;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     security:
 *       - bearerAuth: []
 *     tags: [Blogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The blog ID
 *     responses:
 *       204:
 *         description: Blog deleted
 *       404:
 *         description: Blog not found
 */
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { status: "inactive" });

    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }

    res.status(204).send();
});

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 */
const listBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ status: "active" });
    res.json(blogs);
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: The requested blog
 *       404:
 *         description: Blog not found
 */
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
});

export { createBlog, updateBlog, deleteBlog, listBlogs, getBlog };
