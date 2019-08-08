const mongoose= require("mongoose");

Schema=mongoose.Schema;
const VariantSchema = new Schema({
product_id:{
type:String
},
product_variant_id:{
    type: String,
    unique: true,
},
MRP:{
    type: Number
},
selling_price:{
    type: Number
},
weight:{
    type:String
},
size:{
    type:Number
},
color:{
    type:String
}
  
});





const Variant = mongoose.model('Variant', VariantSchema);
exports.Variant =Variant;
