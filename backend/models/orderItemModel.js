import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const orderItemSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
    },
    { timestamps: true }
);

const OrderItems = mongoose.model("OrderItems", orderItemSchema);
export default OrderItems;

