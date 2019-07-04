const _ =require("lodash");
const auth=require("../middleware/auth");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const {Post} = require("../models/post");
const {Thread} = require("../models/thread");
const express = require("express");
const router = express.Router();

router.post('/respond',auth,async(req,res)=>{
parent_id=await Post.findOne({post_id:req.body.post_id},{vendor_id:1,_id:0});
parent_id=await parent_id.vendor_id;
console.log(parent_id);
let thread= new Thread({
    post_id:req.body.post_id,
    thread_id:req.body.thread_id,
    parent_id:parent_id,
    child_id:req.body.vendor_id,
    response:[{
    price:req.body.price,
    quantity:req.body.quantity,
    desc:req.body.desc,
    publisher:"child"
    }]
})
thread=await thread.save();
await Post.updateOne({post_id:req.body.post_id},{$push:{thread_collection:req.body.thread_id}});
res.send(thread);
})

router.put('/respond/:thread_id',auth,async(req,res)=>{
var parent_id=await Thread.findOne({thread_id:req.params.thread_id},{parent_id:1,_id:0,post_id:1});
if(parent_id==req.body.vendor_id)
{
  var publisher='parent'
}
else
{
var publisher='child'
}
response_object={
price:req.body.price,
quantity:req.body.quantity,
desc:req.body.desc,
publisher:publisher
}
var thread=await Thread.updateOne({thread_id:req.params.thread_id},{$push:{response:response_object}});
res.send({thread,post});
})




router.get('/collection',auth,async(req,res)=>{
Thread.find({}).then((data)=>{
res.send({Threads:data})  
}).catch((err)=>{
res.send({error:err})    
})
})

router.get('/collection/:thread_id',auth,async(req,res)=>{
Post.findOne({thread_id:req.params.thread_id}).then((data)=>{
res.send({thread:data})  
}).catch((err)=>{
res.send({error:err})    
})
})

router.get('/parent_threads/:vendor_id',auth,async(req,res)=>{
Thread.find({parent_id:req.params.vendor_id}).then((data)=>{
res.send({threads:data})  
}).catch(()=>{
res.send({error:err})    
})
})


router.get('/child_threads/:vendor_id',auth,async(req,res)=>{
Thread.find({child_id:req.params.vendor_id}).then((data)=>{
res.send({threads:data})  
}).catch(()=>{
res.send({error:err})    
})
})

module.exports=router;
