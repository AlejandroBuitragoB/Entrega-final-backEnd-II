import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js"; 
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import ProductsModel from "./models/products.models.js";

const app = express();
const PORT = 8080;

// import { Server } from "socket.io";
// import { engine } from "express-handlebars";

mongoose.connect("mongodb+srv://alejandrobuitragob:Inicio.0001@cluster0.u2v5d.mongodb.net/entregaFinalBackEnd?retryWrites=true&w=majority&appName=Cluster0")
      .then(()=> console.log("Conectados a los BD"))
      .catch((error) => console.log("Tenemos un problema", error))

const httpServer = http.createServer(app);
const io = new Server(httpServer);



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


httpServer.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});


io.on("connection", async(socket) => {
    console.log("Un cliente se conecto");
const products = await ProductsModel.find()
    socket.emit("products", products);

    //add product

    socket.on("addProduct", product => {
        const newProduct = ProductsModel.create({...product});
        if(newProduct){
            products.push()
            socket.emit("products", products);
        }
            
    });

    //delete product

    // socket.on('deleteProduct', async (productId) => {
    //     try {
    //         console.log("Received ID to delete:", productId);
    //         const id = Number(productId);
    //         const result = await manager.deleteProduct(id);
            
    //         if (result === undefined) {
    //             socket.emit("error", { message: "Product not found." });
    //         } else {
    //             const updatedProducts = await ProductsModel;
    //             io.emit("products", updatedProducts); 
    //         }
    //     } catch (error) {
    //         console.error("Error while deleting the product", error);
    //         socket.emit("error", { message: "Error while deleting the product" });
    //     }
    // });





});
    




