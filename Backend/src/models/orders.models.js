import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",   // fixed
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  customer: {
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"],
    },
    address: {
      houseNo: String,
      floorNo: String,
      buildingName: String,
      landmark: String,
      pincode: String,
      city: String,
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
