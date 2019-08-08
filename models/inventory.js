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
  is_approved:{
    type:Boolean,
    default:false
  },
  quantity: {
    type: Number
  }
  
});





const Inventory = mongoose.model("Inventory", InventorySchema);
exports.Inventory =Inventory;

