import { Router } from "express";
const router = Router();
import ProductManager from "../manager/product-manager.js";
const manager = new ProductManager("./src/data/products.json")

router.get("/products", async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render("index", {products});
    } catch (error) {
        res.status(500).send("Fatal error");
    }
})

router.get("/realtimeproducts", async (req, res) =>{
    try {
        res.render("realtimeproducts");
    } catch (error) {
        res.status(500).send("Fatal error");
    }
})


    

export default router;