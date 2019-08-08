const mongoose= require("mongoose");

Schema=mongoose.Schema;
const CategorySchema = new Schema({
  category:{
    type: String,
  },
  subcategory:{
    type: String,
  },
  category_id:{
    type: String,
  },
  subcategory_id:{
    type: String,
  },
  weight:{
    type:[String]
  },
  size:{
    type:[Number]
  },
  color:{
    type:[String]
  }
});


const Category = mongoose.model("Category", CategorySchema);
exports.Category =Category;
//exports.ProductSchema = ProductSchema;
