const mongoose= require("mongoose");

Schema=mongoose.Schema;
const CitySchema = new Schema({
  city_name: {
    type: String,
  },
  city_id:{
    type: String,
    unique: true,
  },
  state:{
    type: String,
  }
  
});





const City = mongoose.model("City", CitySchema);
exports.City =City;

