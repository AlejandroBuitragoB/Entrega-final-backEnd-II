import { request, response } from "express";
import {addProductServices, deleteProductServices, getProductsByIdServices, getProductsServices, updateProductServices} from "../services/products.services.js";


export const getProducts = async (req = request, res = response) => {
  try {
    const result = await getProductsServices({ ...req.query });
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
};

export const getProductsById = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const Product = await getProductsByIdServices(pid);
    if (!Product)
      return res.status(404).json({ msg: `product ID ${pid} doesnt exists` });
    return res.json({ Product });
  } catch (error) {
    console.log("getProductsById = ", error);
    return res.status(500).json({ msg: "contact support" });
  }
};

export const addProduct = async (req = request, res = response) => {
  try {
    const { title, description, price, img, code, stock } = req.body;

    if (!title, !description, !price, !img, !code, !stock)
      return res
        .status(404)
        .json({
          msg: "[title,description,price,img,code,stock] are mandatory",
        });

    const product = await addProductServices({...req.body});
    return res.json({ product });

  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;
    const product = await updateProductServices(pid, rest);

    if (product) return res.json({ msg: "Product update", product });
    return res.status(404).json({ msg: `couldnt update product ID ${pid}` });
  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const product = await deleteProductServices(pid);
    if (product) return res.json({ msg: "Product deleted", product });
    return res.status(404).json({ msg: `couldnt delete product ID ${pid}` });
  } catch (error) {
    console.log("deleteProduct = ", error);
    return res.status(500).json({ msg: "contact support" });
  }
};
