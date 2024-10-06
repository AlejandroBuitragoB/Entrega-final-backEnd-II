import express from "express";
import productsRouter from "./routes/products.router.js"; 
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import http from "http";

import ProductManager from "./manager/product-manager.js";
const manager = new ProductManager("./src/data/products.json");

const app = express();
const PORT = 8080;

// import { Server } from "socket.io";
// import { engine } from "express-handlebars";

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


io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");

    socket.emit("products", await manager.getProducts())

    //delete product

    socket.on('deleteProduct', async (productId) => {
        try {
            console.log("Received ID to delete:", productId);
            const id = Number(productId);
            const result = await manager.deleteProduct(id);
            
            if (result === undefined) {
                socket.emit("error", { message: "Product not found." });
            } else {
                const updatedProducts = await manager.getProducts();
                io.emit("products", updatedProducts); 
            }
        } catch (error) {
            console.error("Error while deleting the product", error);
            socket.emit("error", { message: "Error while deleting the product" });
        }
    });




      //add Product


    socket.on('addProducts', (AddNewProducts) =>{
        console.log(AddNewProducts)
    });

});
    




