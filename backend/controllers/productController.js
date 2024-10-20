import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.page) || 1; // Get current page from query params

    // Construct the search keyword if present
    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    // Get the total count of documents matching the keyword
    const count = await Product.countDocuments({ ...keyword });

    // Fetch products with pagination
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1)); // Skip the previous pages

    // Log the data fetched
    console.log("Search Keyword:", req.query.keyword);
    console.log("Total Count of Products:", count);
    console.log("Fetched Products:", products);

    // Return the results
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page * pageSize < count, // Check if more products exist
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server Error" });
  }
});



const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
}); // hàm này trả về một sản phẩm dựa trên id

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment, user, username } = req.body; // Accept user ID and username from the body
    const product = await Product.findById(req.params.id).lean(); // Use .lean() for better performance

    // Validate if the user exists
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === foundUser._id.toString() // Check against foundUser ID
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    // Create the review object
    const review = {
      name: username,
      rating: Number(rating),
      comment,
      user: foundUser._id, // Store the user's ID directly
    };

    // Push the review into the product's reviews array
    product.reviews.push(review);

    // Update the number of reviews and the overall rating
    product.numReviews = product.reviews.length;

    // Calculate the new rating based on all reviews
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save the updated product
    await Product.findByIdAndUpdate(req.params.id, product, { new: true });

    // Respond with a success message
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});



const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// search by product name
const filterProductsByName = asyncHandler(async (req, res) => {
  try {
    const { name } = req.query; // Get the name from query parameters
    console.log(`Received request to filter products by name: ${name}`); // Log the name parameter

    // Validate the name parameter
    if (name && typeof name !== 'string') {
      return res.status(400).json({ error: "Name query parameter must be a string." });
    }

    // Create filter object for the query
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    // Fetch products with the name filter
    const products = await Product.find(filter)
      .populate("category") // Populate category field
      .sort({ createdAt: -1 }); // Ensure 'createdAt' is correctly spelled

    console.log(`Found ${products.length} product(s) matching the name: ${name}`); // Log the number of products found

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found matching the name." });
    }

    res.json(products); // Respond with the found products
  } catch (error) {
    console.error('Error while filtering products:', error); // Log the error details
    res.status(500).json({ error: "Server Error" });
  }
});

export {
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
  filterProductsByName,
};
