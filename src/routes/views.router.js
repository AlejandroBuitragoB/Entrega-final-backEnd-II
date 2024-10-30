import { Router } from "express";
import { ProductsModel } from "../models/products.models.js";
const router = Router();

router.get("/products", async (req, res) => {
    try {
        const products = await ProductsModel.find() ;
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