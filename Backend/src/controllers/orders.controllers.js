import { Order } from "../models/orders.models.js";
import { Product } from "../models/products.models.js";

const placeOrder = async (req, res) => {
  try {
    const { items, customer, totalAmount } = req.body;

    if (!customer || !items?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const finalAmount = totalAmount;

    const order = await Order.create({
      customer, // ✅ nested object will be saved if schema allows it
      items,
      totalAmount: finalAmount,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: `Order placed successfully. Please collect ₹${finalAmount} upon delivery.`,
      order,
    });
  } catch (error) {
    console.error("Error in COD payment:", error);
    return res.status(500).json({
      message: "Something went wrong while processing COD.",
      error: error.message,
    });
  }
};



const getAllOrders = async (req,res) => {
    try{
        const orders = await Order.find().sort({ createdAt: -1});
        res.status(200).json(orders);
    }
    catch(error){
        res.status(500).json({message: "Error fetching orders",error: error.message});
    }
};


export {
    placeOrder,
    getAllOrders,
}