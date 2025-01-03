import userService from "../services/user.services.js";
import jwt from "jsonwebtoken";
import CartsModel from "../dao/models/carts.models.js"



class UserController {
    async register(req, res) {
        const {first_name, last_name, email, age, password} = req.body;
        try {
            const newUser = await userService.registerUser({first_name, last_name, email, age, password});

            const newCart = new CartsModel({
                products: []
            });

            const savedCart = await newCart.save();

            newUser.cartId = savedCart._id;
            await newUser.save(); 

            console.log(newUser); 

            const token = jwt.sign({
                user: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email,
                rol: newUser.rol,
                cartId: savedCart._id
            }, "coderhouse", {expiresIn: "1h"});

            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

            res.redirect("/api/sessions/current"); 

        } catch (error) {
            res.status(500).send("Server Error while registering")
        }
    }

    async login(req, res) {
        const {email, password} = req.body;
        try {
            const user = await userService.loginUser(email, password);

            const token = jwt.sign({
                user: `${user.first_name} ${user.last_name}`,
                email: user.email,
                rol: user.rol
            }, "coderhouse", {expiresIn: "1h"});

            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

            res.redirect("/api/sessions/current"); 

        } catch (error) {
            res.status(500).send("Major error while loging In")
        }
    }

    async current(req, res){
        if(req.user) {

            const userDTO = await userService.generateDTO(req.user);
            res.render("home", {user: userDTO});
        } else {
            res.send("unauthorized");
        }
    }

    async logout (req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }
}

export default UserController;