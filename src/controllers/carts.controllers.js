import { request, response } from "express";
import { CartsModel } from "../models/carts.models.js";

export const getCartById = async (req = request, res= response) => {
  try {
    const {cid } = req.params;
    const cart = await CartsModel.findById(cid);

    if(cart)
        return res.json({cart});

    return res.status(404).json({msg: `ID cart ${cid} doesnt exist`})
  } catch (error) {
    console.log("getCartById = ", error);
    return res.status(500).json({ msg: "contact support" });
  }
};

export const createCart = async (req = request, res= response) => {
  try {
    const cart = await CartsModel.create({});
    return res.json({msg: 'Cart created', cart})
  } catch (error) {
    console.log("createCart = ", error);
    return res.status(500).json({ msg: "contact support" });
  }
};

export const addProductToCart = async (req = request, res= response) => {
  try {
    const {cid, pid} = req.params;
    const cart = await CartsModel.findById(cid);

    if(!cart)
        return res.status(404).json({msg: `cart ID ${cid} doesnt exists`});

    const ProductInCart = cart.products.find(p=>p.id.toString() === pid);
    
    if(ProductInCart)
        ProductInCart.quantity++;
    else
        cart.products.push({id:pid, quantity:1});

        cart.save();

        return res.json({msg: "cart updated", cart});
    
  } catch (error) {
    console.log("addProductToCart = ", error);
    return res.status(500).json({ msg: "contact support" });
  }
};
