import { Router } from "express";
import { addProductToCart, createCart, getCartById, deleteProductsInCart, updateProductsInCart, deleteCart } from "../controllers/carts.controllers.js";

const router = Router();

router.get("/:cid", getCartById);

router.post("/", createCart);

router.post("/:cid/product/:pid", addProductToCart);

router.delete('/:cid/products/:pid', deleteProductsInCart);

router.put('/:cid/products/:pid', updateProductsInCart);

router.delete('/:cid', deleteCart);




export default router;