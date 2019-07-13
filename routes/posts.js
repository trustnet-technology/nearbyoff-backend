const jwt =require("jsonwebtoken");
const _ =require("lodash");
const auth=require("../middleware/auth");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const {Post} = require("../models/post");
const {Thread} = require("../models/thread");
const express = require("express");
const router = express.Router();
var nlp = require('compromise')
fs = require('fs');


router.post('/publish',auth,async(req,res)=>{
let post= new Post({
    vendor_id:req.body.vendor_id,
    category:req.body.category,
    subcategory:req.body.subcategory,
    Price:req.body.Price,
    quantity:req.body.quantity,
    desc:req.body.desc,
    post_id:req.body.post_id,
    mode:req.body.mode
})
post=await post.save();
res.send(post);
})





router.get('/collection',auth,async(req,res)=>{
Post.find({},{thread_collection:0}).then((data)=>{
res.send({posts:data})  
}).catch((err)=>{
res.send({error:err})    
})
})

router.get('/collection/:vendor_id',auth,async(req,res)=>{
Post.find({vendor_id:req.params.vendor_id},{thread_collection:0}).then((data)=>{
res.send({posts:data})  
}).catch((err)=>{
res.send({error:err})    
})
})

router.get('/collection_posts/:post_id',auth,async(req,res)=>{
Post.findOne({post_id:req.params.post_id},{thread_collection:0}).then((data)=>{
res.send({posts:data})  
}).catch(()=>{
res.send({error:err})    
})
})


module.exports=router;