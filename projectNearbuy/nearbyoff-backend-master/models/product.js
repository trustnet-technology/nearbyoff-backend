const mongoose= require("mongoose");

Schema=mongoose.Schema;
const ProductSchema = new Schema({
  vendor_id: {
    type: String,
  },
  category: {
    type: String,
  },
  subcategory: {
    type: String,
  },
  category_id: {
    type: String,
  },
  subcategory_id: {
    type: String,
  },
  product_id: {
    type: String,
    unique: true,
  },
  Price: {
    type: Number,

  },
  quantity: {
    type: Number,

  },
  product_name: {
    type: String,
  },
  product_desc: {
    type: String,
  },
  images:{
    type: [String],
    default: [],
  },
  is_approved:{
    type:Number,
    enum:[0,1,-1],
    default:0
  }
});


const Product = mongoose.model("Product", ProductSchema);
exports.Product =Product;
exports.ProductSchema = ProductSchema;
