import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addProduct,
    updateProductStock,
    deleteProduct,
    updateProductUnitAndPrice,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getAllProductsForAdmin,
    deleteProductByAdmin,
    updateProductByAdmin,
    updateStockByAdmin,
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
router.get("/", getAllProductsForAdmin);
router.delete("/:id", deleteProductByAdmin);
router.put("/:id", updateProductByAdmin);
router.patch("/:id/stock", updateStockByAdmin);

export default router;
