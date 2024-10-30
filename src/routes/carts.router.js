import { Router } from "express";
import { addProductToCart, createCart, getCartById } from "../controllers/carts.controllers.js";

const router = Router();

router.post("/", getCartById)

router.get("/:cid", createCart)



router.post("/:cid/product/:pid", addProductToCart)




export default router;