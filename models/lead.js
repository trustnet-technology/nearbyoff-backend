const mongoose= require("mongoose");

Schema=mongoose.Schema;
const LeadSchema = new Schema({
  vendor_id: {
    type: String,
    require:true
  },
  product_variant_id:{
   type:String,
   require:true
  },
  product_id:{
    type:String,
    require:true
   },

  user_id: {
    type: String,
    
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
  result:{
    type:Number,
    enum:[0,1,-1],
    default:0
  },
  vendor_name:{
    type:String
  },
  product_price:{
    type:Number
  },
  date:{
    type:String
  }
  
});


const Lead = mongoose.model("Lead", LeadSchema);
exports.Lead =Lead;
exports.LeadSchema = LeadSchema;
