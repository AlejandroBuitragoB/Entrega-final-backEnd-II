import { Router } from "express";
import { getProducts, getProductsById, addProduct, deleteProduct, updateProduct } from "../controllers/products.controllers.js";

const router = Router();

router.get('/', getProducts);

router.get("/:pid", getProductsById);

router.post("/", addProduct);

router.put("/:pid", updateProduct)

router.delete("/:pid", deleteProduct)

export default router;
