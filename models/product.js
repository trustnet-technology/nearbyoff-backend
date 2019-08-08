const mongoose= require("mongoose");

Schema=mongoose.Schema;
const ProductSchema = new Schema({
  vendor_id:{
    type:String
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
  is_main_vendor:{
    type:Boolean,
    default:false
  },
  product_name: {
    type: String,
    default:""
  },
  brand_name: {
    type: String,
    default:""
  },
  product_desc: {
    type: String,
  },
  images:{
    type: [String],
    default: [],
  },
  city:{
    type:String
  },
  title:{
    type:String
  }

});


const Product = mongoose.model("Product", ProductSchema);
exports.Product =Product;
exports.ProductSchema = ProductSchema;
