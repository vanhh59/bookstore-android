import Product from "../models/productModel.js";
import OrderItems from "../models/orderItemModel.js";
import mongoose from "mongoose";

const addOrderItem = async (req, res) => {
    try {
        const { product, qty } = req.body;

        // Validate product ID format before querying
        if (!mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Check if the product exists in the database
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Create a new order item
        const orderItem = new OrderItems({
            name: productExists.name, // Use product's name from the database
            qty,
            image: productExists.image, // Use product's image from the database
            price: productExists.price, // Use product's price from the database
            product: productExists._id, // Reference the product's _id
        });

        // Save the order item to the database
        const newOrderItem = await orderItem.save();

        // Respond with the newly created order item
        res.status(201).json({
            success: true,
            message: "Order item created successfully",
            data: newOrderItem,
        });
    } catch (error) {
        // Use 500 for server-side errors
        res.status(500).json({ message: error.message });
    }
};


const getOrderItem = async (req, res) => {
    try {
        // Fetch order items with specific fields and product ID
        const orderItems = await OrderItems.find()
            .select("name qty image price product")
            .populate("product", "_id"); // Only populate the product's _id field

        // Respond with the filtered order items
        res.status(200).json({
            success: true,
            data: orderItems,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export { addOrderItem, getOrderItem };