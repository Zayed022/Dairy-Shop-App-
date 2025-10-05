import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addProduct,
    updateProductStock,
    deleteProduct,
    updateProductUnitAndPrice,
    getAllProducts,
    getProductById,
    getProductsByCategory,
 } from "../controllers/products.controllers.js";

const router = Router();

router.route("/add-product").post(
upload.fields([
    {
        name:"image",
        maxCount:1
    }
]),
addProduct
)

router.route("/get-product").get(getAllProducts);
router.route("/:id").get(getProductById)
router.delete("/delete", deleteProduct);
router.put("/:id/update-unit-price", updateProductUnitAndPrice);
router.put("/:id/update-stock", updateProductStock);
router.get("/category/:category", getProductsByCategory);

export default router;
