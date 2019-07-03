const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const admin_middleware=require("../middleware/admin");
const {Vendor} = require("../models/vendor");
const {Lead} = require("../models/lead");
const {Product} = require("../models/product");
const _ =require("lodash");
const express = require("express");
const router = express.Router();



router.post('/generate', async(req,res)=>{
let product=await Product.findOne({product_id:req.body.product_id});
const lead= new Lead({
product_id:req.body.product_id,
contact_no:req.body.contact_no,
quantity:req.body.quantity,
vendor_id:product.vendor_id,
customer_name:req.body.customer_name,
product_name:product.product_name,
product_desc:product.product_desc,
images:product.images
});
await lead.save().then((data)=>{
res.send({product:data,message:"lead generated successfully"});   
}).catch((err)=>{
res.send(err);
})
});

router.get('/vendor/:vendor_id',auth, async(req,res)=>{
Lead.find({vendor_id:req.params.vendor_id},{_id:0,__v:0}).then((data)=>{
res.send({leads:data})
}).catch((err)=>{
res.send(err)
})
})

router.get('/admin',auth,admin_middleware, async(req,res)=>{
Lead.aggregate([{$group: {_id: "$vendor_id",count:{$sum:1}}}
]).then((d)=>{
res.send(d);
});
})




module.exports=router;