import { Router } from "express";
import ProductManager from "../manager/product-manager.js";
const router = Router();
const manager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  let limit = req.query.limit;

  try {
    const productArray = await manager.getProducts();

    if (limit) {
      res.send(productArray.slice(0, limit));
    } else {
      res.send(productArray);
    }
  } catch (error) {
    res.status(500).send("server error");
  }
});

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const searchedProduct = await manager.getProductById(parseInt(id));

    if (!searchedProduct) {
      res.send("Product not found");
    } else {
      res.send(searchedProduct);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;

  try {
    await manager.addProduct(newProduct);
    res.status(201).send("Product added successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});


router.put("/:pid", async (req, res) => {
  let id = parseInt(req.params.pid);
  let updatedProduct = req.body;

  try {
    await manager.updateProduct(id, updatedProduct);

    res.status(200).send("Product updated");
    
} catch (error) {
    res.status(500).send("There was an arror while updating products"); 
}
});

router.delete("/:pid", async (req, res) => {
  let id = parseInt(req.params.pid);

  try {
   await manager.deleteProduct(id);

    res.status(201).send("Product deleted");
   
} catch (error) {
  res.status(500).send("There was an error while deleting product"); 
}
})

export default router;
