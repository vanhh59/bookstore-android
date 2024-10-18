import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
