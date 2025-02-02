// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerDocs from "./swagger.js";
// Utiles
import connectDB from "./backend/config/db.js";
import userRoutes from "./backend/routes/userRoutes.js";
import categoryRoutes from "./backend/routes/categoryRoutes.js";
import productRoutes from "./backend/routes/productRoutes.js";
import uploadRoutes from "./backend/routes/uploadRoutes.js";
import orderRoutes from "./backend/routes/orderRoutes.js";
import blogRoutes from "./backend/routes/blogRoutes.js"; // Import blog routes
import paymentBillRoutes from "./backend/routes/paymentBillRoutes.js";
import orderItemRoutes from "./backend/routes/orderItemRoutes.js";

dotenv.config();
const port = process.env.PORT || 10000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Allow all origins for testing
    credentials: true, // Send cookies
  })
);

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blogs", blogRoutes); // Use blog routes
app.use("/api/payment-bills", paymentBillRoutes); // Payment bill routes
app.use("/api/order-items", orderItemRoutes);
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on http://localhost:${port}/api/`));
swaggerDocs(app, port);
