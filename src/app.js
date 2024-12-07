import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js"; 
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import ProductsModel from "./models/products.models.js";
import { deleteProduct } from "./controllers/products.controllers.js";
import { getProductsServices, addProductServices } from "./services/products.services.js";
import "./database.js";
import initializePassport from "./config/passport.config.js";
import sessionRouter from "./routes/sessions.router.js";

import cookieParser from "cookie-parser";
import passport from "passport";

const app = express();
const PORT = 8080;

// import { Server } from "socket.io";
// import { engine } from "express-handlebars";

// mongoose.connect("mongodb+srv://alejandrobuitragob:Inicio.0001@cluster0.u2v5d.mongodb.net/entregaFinalBackEnd?retryWrites=true&w=majority&appName=Cluster0")
//       .then(()=> console.log("Conectados a los BD"))
//       .catch((error) => console.log("Tenemos un problema", error))

const httpServer = http.createServer(app);
const io = new Server(httpServer);



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();
app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


httpServer.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});


io.on("connection", async(socket) => {
const {payload} = await getProductsServices({});
const products = payload
    socket.emit("products", payload);

    //add product

    socket.on("addProduct", async (product) => {
        const newProduct = await addProductServices({...product});
        if(newProduct){
          products.push(newProduct)
            socket.emit("products", products);
        }
            
    });

    // delete product

    socket.on('deleteProduct', async (productId) => {
        try {
            console.log("Received ID to delete:", productId);
            const result = await ProductsModel.findByIdAndDelete(productId); // No es necesario convertir a Number
            
            if (result === null) {
                socket.emit("error", { message: "Product not found." });
            } else {
                // Obtener la lista actualizada de productos
                const updatedProducts = await ProductsModel.find(); // Asegúrate de obtener todos los productos
                io.emit("products", updatedProducts); // Emitir la lista actualizada a todos los clientes
            }
        } catch (error) {
            console.error("Error while deleting the product", error);
            socket.emit("error", { message: "Error while deleting the product" });
        }
    });

});
    




