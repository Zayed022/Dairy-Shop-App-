import { Product } from "../models/products.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import NodeCache from "node-cache";
import mongoose from "mongoose";

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const addProduct = async (req,res) => {
    const {
        name,
        unit,
        price,
        category,
        stock,
    } = req.body;
    if(!(name  || price || category )){
        return res.status (401).json({message:"All fields are rquired"})
    };
    const imageLocalPath = req.files?.image[0]?.path;
    console.log(imageLocalPath);
    if(!imageLocalPath){
        return res.status(400).json({message: "Image file is required"});
    }
    const image = await uploadOnCloudinary(imageLocalPath);
    if(!image){
        return res.status(400).json({message:"Image file is required"});
    }

    const product = await Product.create({
        name,
        unit,
        price,
        category,
        stock,
        image: image.url,
    });
    const createdProduct = await Product.findById(product._id).select("");
    if(!createdProduct){
        return res.status(500).json({message:"Something went wrong"})
    }
    return res.status(201).json({
        createdProduct,
        message:"Product created successfully",
    });
};


const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ message: "Product deleted successfully" });
};

const getAllProducts = async (req, res) => {
  try {
    const searchQuery = req.query.search?.trim() || "";
    const cacheKey = `allProducts_${searchQuery}`;

    // ✅ Step 1: Try cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // ✅ Step 2: Use regex efficiently + project only needed fields
    const filter = searchQuery ? { name: { $regex: searchQuery, $options: "i" } } : {};

    // ⚙️ Use projection to send only required fields (reduces data size by 70–80%)
    const products = await Product.find(filter, "name price unit image category stock")
      .sort({ createdAt: -1 })
      .limit(100) // hard limit for safety
      .lean(); // returns plain JS objects (faster than Mongoose docs)

    // ✅ Step 3: Cache results for 60 seconds
    cache.set(cacheKey, products);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};


const updateProductUnitAndPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit, price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { unit, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};


const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Stock updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const cacheKey = `category_${category.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Case-insensitive exact match (uses index)
    const products = await Product.find(
      { category: new RegExp(`^${category}$`, "i") },
      "name price unit image category stock"
    )
      .sort({ createdAt: -1 })
      .lean();

    cache.set(cacheKey, products);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

const getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const deleteProductByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};


const updateProductByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, price, category } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      { name, unit, price, category },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ updated, message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};


const updateStockByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ updated, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update stock" });
  }
};





export {
    addProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProductUnitAndPrice,
    updateProductStock,
    getProductsByCategory,
    getAllProductsForAdmin,
    deleteProductByAdmin,
    updateProductByAdmin,
    updateStockByAdmin,
}