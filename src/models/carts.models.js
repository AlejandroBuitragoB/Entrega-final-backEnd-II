import mongoose, { Schema } from "mongoose";

const cartsSchema = new mongoose.Schema({
 products:[
  {
    _id: false,
    id:{
      type:Schema.Types.ObjectId,
      ref: 'products'
  },
  quantity:{
      type:Number,
      required:[true, "Product quantity is mandatory"]
  }
  }

 ]
});

cartsSchema.set('toJSON',{
  transform: function(doc,ret){
      delete ret.__v;
      return ret;
  }
});

const CartsModel = mongoose.model("carts", cartsSchema);


export default CartsModel;