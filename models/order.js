const mongoose= require("mongoose");

Schema=mongoose.Schema;
const OrderSchema = new Schema({
  vendor_id: {
    type: String,
    require: true,
  },
  order_id: {
    type: String,
    
  },

  user_id: {
    type: String,
    
  },
  
  product_variant_id: {
    type: String,
    
  },
  product_id: {
    type: String,
    
  },
  contact_no: {
    type: Number,
    
    minLength: 10,
    maxLength: 10,
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
  images: {
    type: [String],
    default: [],
  },
  customer_name: {
    type: String,
  },
  comment: {
    type: String,
  },
  payment_method: {
    type: String,
    enum: ["online", "cod"]
  },
  vendor_name: {
    type: String,
  },
  product_price: {
    type: Number,
  },
  date: {
    type: Date,
  },
  Address: {
    type: String,
  },
  status:{
    type:String
  }

});


const Order = mongoose.model("Order", OrderSchema);
exports.Order =Order;
