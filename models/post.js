const mongoose= require("mongoose");

Schema=mongoose.Schema;
const PostSchema = new Schema({
  vendor_id: {
    type: String,
  },
  post_id: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
  },
  subcategory: {
    type: String,
  },
  Price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  mode: {
    type:String,
    enum:['buy','sell']
  },
  desc:{
      type:String,
      default:""
  },
  thread_collection:{
     type:[String],
     default:[] 
  },
  is_abusive:{
    type:Boolean,
    default:false
  }
});


const Post = mongoose.model("Post", PostSchema);
exports.Post =Post;
exports.PostSchema = PostSchema;
