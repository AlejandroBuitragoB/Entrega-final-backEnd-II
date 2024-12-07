import { Router } from "express";
import UserModel from "../models/users.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/util.js";
import CartsModel from '../models/carts.models.js'

const router = Router();

router.post("/register", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    try {
        const emailExist = await UserModel.findOne({email});

        if(emailExist) {
            return res.status(400).send("user already exists");
        }

        const newCart = new CartsModel({
            products: [] 
        });

        const savedCart = await newCart.save();

        const newUser = new UserModel ({
            first_name,
            last_name,
            email,
            age,
            cartId: savedCart._id,
            password: createHash(password),
        });

        await newUser.save();

        const token = jwt.sign({email: newUser.email, first_name: newUser.first_name, rol: newUser.rol, cartId: savedCart._id}, "coderhouse", {expiresIn: "1h"});

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true,
        })

        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Major error at registering");
    }
})


router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const userFound = await UserModel.findOne({email});

        if(!userFound) {
            return res.status(401).send("invalid User");
        }


        if(!isValidPassword(password, userFound)) {
            return res.status(401).send("password error"); 
        }
        
        const token = jwt.sign({email: userFound.email, first_name: userFound.first_name, rol: userFound.rol, cartId: userFound.cartId }, "coderhouse", {expiresIn: "1h"});

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true,
        })

        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Major error while loging in");
    }
})

router.get("/current", passport.authenticate("current", {session: false}), async (req, res) => {
    const { cartId, first_name } = req.user;


        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                    return res.status(404).send("Cart not found");
                }
    
                // Renderiza la vista "home", pasando el first_name y el carrito
                res.render("home", {first_name: req.user.first_name, cart: cart});
        } catch (error) {
            res.status(500).send("Error loading cart");
        }
});


router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");

    res.redirect("/login");
})

router.get("/admin", passport.authenticate("current", {session:false}), (req, res) =>{
if (req.user.rol !== "admin") {
    return res.status(403).send("access declined");
}
res.render("admin");
})

export default router