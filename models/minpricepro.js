/* eslint-disable key-spacing */
const mongoose= require("mongoose");

Schema=mongoose.Schema;
const MinproSchema = new Schema({
  
  product_id: {
    type: String,
  },
  minprice:{
      type:Number
  }

});


const minpricepro = mongoose.model("minpricepro", MinproSchema);
exports.minpricepro =minpricepro;
