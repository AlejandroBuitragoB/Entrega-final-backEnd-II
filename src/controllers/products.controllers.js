import { request, response } from "express";
import { ProductsModel } from "../models/products.models.js";

export const getProducts = async (req = request, res= response) =>{
try {
    // const { limit } = req.query;
    const Products = await ProductsModel.find();
    return res.json({ Products});
} catch (error) {
    console.log("getProducts = ", error);
    return res.status(500).json({ msg: "contact support"});
}
}

export const getProductsById = async (req = request, res= response) =>{
    try {
        const {pid} = req.params;
        const Product = await ProductsModel.findById(pid);
        if(!Product)
            return res.status(404).json({ msg: `product ID ${pid} doesnt exists`})
        return res.json({ Product });
    } catch (error) {
        console.log("getProductsById = ", error);
        return res.status(500).json({ msg: "contact support"});
    }
    }

export const addProduct = async (req = request, res= response) =>{
    try {
        const {title, description, price, img, code, stock} = req.body;

        if(!title, !description, !price, !img, !code, !stock)
            return res.status(404).json({ msg: "[title,description,price,img,code,stock] are mandatory" });

        const product = await ProductsModel.create({title, description, price, img, code, stock});
        return res.json({ product});
    } catch (error) {
        console.log("addProduct = ", error);
        return res.status(500).json({ msg: "contact support"});
    }
}

export const updateProduct = async (req = request, res= response) =>{
    try {
      const {pid} = req.params;
      const {_id, ...rest} = req.body;
      const product = await ProductsModel.findByIdAndUpdate(pid,{...rest}, {new:true});

      if(product)
          return res.json({msg: "Product update", product});
      return res.status(404).json({msg: `couldnt update product ID ${pid}`})
      
    } catch (error) {
      console.log("updateProduct = ", error);
          return res.status(500).json({ msg: "contact support"});
    }
      }

export const deleteProduct = async (req = request, res= response) =>{
  try {
    const {pid} = req.params;
    const product = await ProductsModel.findByIdAndDelete(pid);
    if(product)
        return res.json({msg: "Product deleted", product});
    return res.status(404).json({msg: `couldnt delete product ID ${pid}`})

  } catch (error) {
    console.log("deleteProduct = ", error);
        return res.status(500).json({ msg: "contact support"});
  }
    }