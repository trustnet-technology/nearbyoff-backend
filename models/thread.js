const mongoose= require("mongoose");
Schema=mongoose.Schema;
const ResponseSchema = new Schema({
    price: Number,
    quantity: String,
    desc:{
        type:String,
        default:""
    },
    publisher:{
        type:String,
        enum:['parent','child']
    },
    is_abusive:{
    type:Boolean,
    default:false
    }
  });

const ThreadSchema = new Schema({
  thread_id: {
    type: String,
    unique:true
  },
  post_id: {
    type: String,
    unique: true,
  },
  parent_id: {
    type: String,
  },
  child_id: {
    type: String,
    unique: true,
  },
  response:{
      type:[ResponseSchema],
  }
  

});


const Thread = mongoose.model("Thread", ThreadSchema);
exports.Thread =Thread;
exports.ThreadSchema = ThreadSchema;
