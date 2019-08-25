/* eslint-disable key-spacing */
const mongoose= require("mongoose");

Schema=mongoose.Schema;
const MinSubSchema = new Schema({
  category: {
    type: String,
  },
  subcategory: {
    type: String,
  },
  minprice:{
      type:Number
  }

});


const minpricesub = mongoose.model("minpricesub", MinSubSchema);
exports.minpricesub =minpricesub;

