import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {type: String, required:[true, "product title is mandatory"]},
    description: {type: String, required:[true, "product description is mandatory"]},
    price: {type: Number, required:[true, "product price is mandatory"]},
    img: String,
    code: {type: String, required:[true, "product code is mandatory"], unique: true},
    stock: {type: Number, required:[true, "product price is mandatory"]},
});

productsSchema.set('toJSON',{
    transform: function(doc,ret){
        delete ret.__v;
        return ret;
    }
});

const ProductsModel = mongoose.model("products", productsSchema);


export default ProductsModel;