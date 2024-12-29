import { Router } from "express";
import { addProductToCart, createCart, getCartById, deleteProductsInCart, updateProductsInCart, deleteCart } from "../controllers/carts.controllers.js";
import { purchaseController } from "../controllers/purchase.controllers.js";
import passport from "passport";



const router = Router();

router.get("/:cid", getCartById);

router.post("/", createCart);

router.post("/:cid/product/:pid", addProductToCart);

router.delete('/:cid/products/:pid', deleteProductsInCart);

router.put('/:cid/products/:pid', updateProductsInCart);

router.delete('/:cid', deleteCart);

router.post("/purchase/:cid/", passport.authenticate('jwt', { session: false }), purchaseController);




export default router;