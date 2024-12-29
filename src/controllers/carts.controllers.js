import { request, response } from "express";
import { getCartByIdServices, createCartServices, addProductToCartServices, deleteProductsInCartServices, deleteCartServices, updateProductsInCartServices } from "../services/carts.services.js";
import { purchase } from "../services/purchase.services.js";




export const getCartById = async (req = request, res= response) => {
  try {
    const {cid } = req.params;
    const cart = await getCartByIdServices (cid);
    
    if(cart)
        return res.json({cart});

    return res.status(404).json({msg: `ID cart ${cid} doesnt exist`})
  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
};

export const createCart = async (req = request, res= response) => {
  try {
    const cart = await createCartServices();
    return res.json({msg: 'Cart created', cart})
  } catch (error) {
    console.log("createCart = ", error);
    return res.status(500).json({ msg: "contact support" });
  }
};

export const addProductToCart = async (req = request, res= response) => {
  try {
    const {cid, pid} = req.params;
    const cart = await addProductToCartServices(cid, pid);

    if(!cart)
        return res.status(404).json({msg: `cart ID ${cid} doesnt exists`});

        return res.json({msg: "cart updated", cart});
    
  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
};

export const deleteProductsInCart = async (req = request, res = response) => {
  try {
    const {cid, pid} = req.params;
    const cart = await deleteProductsInCartServices(cid, pid);
    if(!cart)
      return res.status(404).json({msg:"Product couldnt be deleted"});
    return res.json({msg:"product has been deleted", cart});
  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
}

export const updateProductsInCart = async (req = request, res = response) => {
  try {
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    if(!quantity || !Number.isInteger(quantity))
      return res.status(404).json({msg:"Quantity property is mandatory and most be an integer"});

    const cart = await updateProductsInCartServices(cid, pid, quantity);

    if(!cart)
      return res.status(404).json({msg:"Product couldnt be updated"});

    return res.json({msg:"Product has been updated", cart})
  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
}

export const deleteCart = async (req = request, res= response) => {
  try {
    const {cid} = req.params;

const cart = await deleteCartServices(cid);

    if(!cart)
      return res.status(404).json({msg:"Product couldnt be updated"});
    return res.json({msg:"product has been updated", cart});
  } catch (error) {
    return res.status(500).json({ msg: "contact support" });
  }
}

export const purchaseController = async (req = request, res = response) => {
  try {
    const { cid } = req.params; 
    const user = req.user; 

    const { ticket, updatedProducts, failedProducts, totalAmount, userEmail } = await purchase(cid, user);

    return res.status(200).json({
      msg: `Purchase completed. Ticket ID: ${ticket._id}, Total: ${totalAmount}, User: ${userEmail}`,
      purchaseData: {
        ticket,
        processedProducts: updatedProducts,
        nonProcessedProducts: failedProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: `Error while processing purchase: ${error.message}` });
  }
};
