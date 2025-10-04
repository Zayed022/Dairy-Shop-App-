import { Router } from "express";
import {
    placeOrder,
    getAllOrders,
} from "../controllers/orders.controllers.js"

const router = Router();

router.post("/create-cod-order", placeOrder)
router.get("/get-all-orders",getAllOrders)

export default router