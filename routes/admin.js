const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const admin_middleware=require("../middleware/admin");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const _ =require("lodash");
const express = require("express");
const router = express.Router();

router.put('/approve_vendor/:vendor_id',auth,admin_middleware ,async(req,res)=>{
Vendor.findOneAndUpdate({vendor_id:req.params.vendor_id},{$set:{is_approved:req.body.action}},
{useFindAndModify: false, new: true}).then((d)=>{
res.send(d)  
}).catch((e)=>{
res.send(e);
})
});


router.put('/approve_product/:product_id',auth,admin_middleware ,async(req,res)=>{
Product.findOneAndUpdate({product_id:req.params.product_id},{$set:{is_approved:req.body.action}},
{useFindAndModify: false, new: true}).then((d)=>{
res.send(d)  
}).catch((e)=>{
res.send(e);
})
});


router.get('/',auth,admin_middleware ,async(req,res)=>{
res.send("Congrats you are an admin");
});



module.exports=router;
