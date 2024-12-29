import  CartsModel  from "../dao/models/carts.models.js"


export const getCartByIdServices = async (cid) => {
  try {
    return await CartsModel.findById(cid).populate('products.id');

  } catch (error) {
    console.log("getCartById = ", error);
    throw error;
  }
};

export const createCartServices = async () => {
  try {
    return await CartsModel.create({});
  } catch (error) {
    console.log("createCart = ", error);
    throw error;
  }
};

export const addProductToCartServices = async (cid, pid) => {
  try {
    const cart = await CartsModel.findById(cid);

    if(!cart)
        return null;

    const ProductInCart = cart.products.find(p=>p.id.toString() === pid);
    
    if(ProductInCart)
        ProductInCart.quantity++;
    else
        cart.products.push({id:pid, quantity:1});

        cart.save();

        return cart;
    
  } catch (error) {
    console.log("addProductToCartServices = ", error);
    throw error;
  }
};

export const deleteProductsInCartServices = async (cid, pid) => {
  try {
   return await CartsModel.findByIdAndUpdate(cid, {$pull:{'products':{id:pid}}},{new: true});
  } catch (error) {
    console.log("deteleProductsToCartServices = ", error);
    throw error;
  }
}

export const updateProductsInCartServices = async (cid, pid, quantity) => {
  try {
   return await CartsModel.findOneAndUpdate(
    {_id:cid,'products.id':pid},
    {$set: {'products.$.quantity':quantity}},
    {new: true}
   );
  } catch (error) {
    console.log("deleteteProductsToCartServices = ", error);
    throw error;
  }
}

export const deleteCartServices = async (cid) => {
  try {
  //  return await CartsModel.findByIdAndUpdate(cid, {$set:{'products':[]}},{new: true});
   return await CartsModel.findByIdAndDelete(cid);
  } catch (error) {
    console.log("deteteCartServices = ", error);
    throw error;
  }
}



