import CartsModel from "../dao/models/carts.models.js";
import ProductsModel from "../dao/models/products.models.js";
import { createTicketService } from "./ticket.services.js"; 
import UserDao from "../dao/user.dao.js"; 

export const purchase = async (cid, user) => {
  try {
    let totalAmount = 0;
    const purchaseComplete = [];
    const purchaseError = [];

 
    const cart = await CartsModel.findById(cid).populate("products.id");
    if (!cart || cart.userId.toString() !== user._id.toString()) {
      throw new Error(`Cart ID ${cid} does not exist or does not belong to the user`);
    }

  
    for (let item of cart.products) {
      const product = await ProductsModel.findById(item.id);
      if (!product) {
        purchaseError.push(item);
        continue;
      }

      if (product.stock < item.quantity) {
        purchaseError.push(item);
        continue;
      }

      const productTotal = product.price * item.quantity;
      totalAmount += productTotal;
      purchaseComplete.push(item);
    }

  
    if (purchaseComplete.length === 0) {
      throw new Error("No products could be processed due to lack of stock.");
    }

  
    const updatedProducts = [];
    const failedProducts = [];
    for (let item of purchaseComplete) {
      const product = await ProductsModel.findById(item.id);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity; 
        await product.save();
        updatedProducts.push(item);
      } else {
        failedProducts.push(item);
      }
    }


    if (failedProducts.length > 0) {
      throw new Error("Some products could not be updated due to insufficient stock.");
    }
  
    const ticketData = {
      userId: user._id,
      products: updatedProducts,
      totalAmount: totalAmount,
      status: 'completed',
    };
    const ticket = await createTicketService(ticketData);

    await UserDao.clearCart(user._id);

    return {
      ticket,
      updatedProducts,
      failedProducts,
      totalAmount,
      userEmail: user.email,
    };
  } catch (error) {
    console.error(`Error in purchase process: ${error.message}`);
    throw error;
  }
};
