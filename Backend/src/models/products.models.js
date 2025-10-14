import mongoose, { Schema } from "mongoose";

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, // ⚡ speeds up search
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "",
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Dairy", "Bread", "Eggs", "Others"],
      required: true,
      index: true, // ⚡ helps in category filtering
    },
    stock: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

// 🧠 Create a compound index for most-used queries (search + category + sort)
productsSchema.index({ name: 1, category: 1, createdAt: -1 });

// 🚀 Optional: Text index for full-text search (e.g., “milk” or “milk powder”)
productsSchema.index({ name: "text" });

export const Product = mongoose.model("Product", productsSchema);
