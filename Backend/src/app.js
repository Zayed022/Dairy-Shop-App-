import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import productRoute from "./routes/products.routes.js"
app.use("/api/v1/products",productRoute);

import orderRoute from "./routes/orders.routes.js"
app.use("/api/v1/orders",orderRoute);

import feeRoute from "./routes/fee.routes.js"
app.use("/api/v1/fee",feeRoute);

import settingRoute from "./routes/settings.routes.js"
app.use("/api/v1/settings",settingRoute);


export {app}