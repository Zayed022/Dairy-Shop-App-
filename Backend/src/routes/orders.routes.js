import { Router } from "express";
import {
    placeOrder,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/orders.controllers.js"

const router = Router();

router.post("/create-cod-order", placeOrder)
router.get("/get-all-orders",getAllOrders)
router.put("/:id/status", updateOrderStatus);

export default router