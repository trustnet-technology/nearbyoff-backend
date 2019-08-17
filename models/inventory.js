const mongoose= require("mongoose");

Schema=mongoose.Schema;
const InventorySchema = new Schema({
  vendor_id: {
    type: String,
  },
  product_variant_id:{
    type: String,
    unique: true,
  },
  product_id:{
    type:String
  },
  approved_quantity: {
    type: Number
  },
  unapproved_quantity: {
    type: Number
  },
  is_main_vendor:{
    type:Boolean
  }
  
});





const Inventory = mongoose.model("Inventory", InventorySchema);
exports.Inventory =Inventory;

