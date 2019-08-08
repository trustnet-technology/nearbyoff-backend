const mongoose= require("mongoose");

Schema=mongoose.Schema;
const OrderSchema = new Schema({
  vendor_id:{
    type: String,
    require:true
  },
  product_variant_id:{
   type:String,
   require:true
  },
  contact_no:{
  type:Number,
  require:true,
  minLength:10,
  maxLength:10
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
  customer_name:{
    type:String  
  },
  comment:{
    type:String
  },
  Payment:{
    type:String,
    enum:["online","cod",],
    default:"cod"
  },
  vendor_name:{
    type:String
  },
  product_price:{
    type:Number
  },
  date:{
    type:Date
  },
  Address:{
    type:String
  }
  
});


const Order = mongoose.model("Order", OrderSchema);
exports.Order =Order;
