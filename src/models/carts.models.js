import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
 products:[
   {
    id:{
        type:Schema.Types.ObjetId,
        ref: 'products'
    },
    quantity:{
        type:Number,
        required:[true, "Product quantity is mandatory"]

    }
   }
 ]
});

const CartsModel = mongoose.model("carts", cartsSchema);



export default CartsModel;