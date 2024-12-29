import { Router } from "express";
import { getProductsServices } from "../services/products.services.js";
import passport from "passport";

import { soloAdmin, soloUser } from "../middleware/auth.js";

const router = Router();

router.get("/products", passport.authenticate("jwt", {session: false}), soloUser, async (req, res) => {
    try {
       const result = await getProductsServices({...req.query});
    res.render("products", {products: result});
    } catch (error) {
        res.status(500).send("Fatal error");
    }
})

router.get("/realtimeproducts",passport.authenticate("jwt", {session: false}), soloAdmin ,(req, res) =>{
    try {
        res.render("realtimeproducts");
    } catch (error) {
        res.status(500).send("Fatal error");
    }
})


router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register");
})

export default router;