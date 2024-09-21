import { Router } from "express";
import CartManager from "../manager/cart-manager.js";
const cartManager = new CartManager("./src/data/carts.json");
const router = Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.send(newCart);
    } catch (error) {
        res.status(500).send("server error");
    }
})

router.get("/:cid", async (req, res) => {
    let cartId = parseInt(req.params.cid);
    try {
        const searchedCart = await cartManager.getCartById(cartId)

        res.json(searchedCart.products);
    } catch (error) {
        res.status(500).send("server error");
    }
})



router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("server error");
    }
})




export default router;