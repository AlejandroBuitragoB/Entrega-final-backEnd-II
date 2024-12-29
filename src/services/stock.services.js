import { updateProductStock } from "./products.services.js"; 


export const updateStockAfterPurchase = async (cartProducts) => {
  try {
    const updatedProducts = []; 
    const failedProducts = [];   

    for (let item of cartProducts) {
      const { productId, quantity } = item;

      try {
        const updatedProduct = await updateProductStock(productId, quantity);
        updatedProducts.push(updatedProduct); 
      } catch (error) {
        failedProducts.push({ productId, error: error.message }); 
      }
    }

    return { updatedProducts, failedProducts };
  } catch (error) {
    console.log("Error al actualizar el stock después de la compra: ", error);
    throw new Error("Error al actualizar el stock de los productos.");
  }
};