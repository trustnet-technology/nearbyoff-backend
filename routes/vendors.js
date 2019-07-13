const _ =require("lodash");
const bcrypt=require("bcrypt");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const auth=require("../middleware/auth");
const express = require("express");
const router = express.Router();
const jwt=require("jsonwebtoken");


router.post("/register", auth, async (req, res) => {
  const token=req.header("x-auth-token");
  const decoded=jwt.verify(token, "secretkey");
  const vendor= new Vendor({
    vendor_id: String(decoded._id)+String(Date.now()),
    user_id: decoded._id,
    category: req.body.category,
    contact_no: req.body.contact_no,
    Address: {
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      Address3: req.body.Address3,
    },
    vendor_name: req.body.vendor_name,
    operating_hrs: {
      opening_time: req.body.opening_time,
      closing_time: req.body.closing_time,
    },
  });
  await vendor.save().catch((e)=>{
    res.send(e);
  });
  res.send(vendor);
});


router.put("/onboarding", auth, async (req, res) => {
  const token=req.header("x-auth-token");
  const decoded=jwt.verify(token, "secretkey");
  if (!(String(req.body.vendor_id).substring(0, 24)==String(decoded._id))) {
    return res.send({message: "invalid request user not matched"});
  }
  const vendor=await Vendor.findOneAndUpdate({vendor_id: req.body.vendor_id},
      {$set: {shop_desc: req.body.shop_desc, shop_name: req.body.shop_name}},
      {useFindAndModify: false, new: true});
  res.send(vendor);
});


router.put("/onboarding_images", auth, async (req, res) => {
  const vendor=await Vendor.findOneAndUpdate({vendor_id: req.body.vendor_id},
      {$set: {category_images: req.body.category_images, shop_images: req.body.shop_images}}
      ,{new: true});
  res.send(vendor);
});

router.get("/products/:vendor_id", auth, async (req, res) => {
  Product.aggregate([
    {$match: {vendor_id: req.params.vendor_id}},
    {$group: {
      _id: "$category", prices: {$push: "$Price"}}},
  ]).then((d)=>{
    res.send(d);
  });
});


router.get("/info/:vendor_id", auth, async (req, res) => {
Vendor.findOne({vendor_id:req.params.vendor_id},{products:0,vendor_id:0,_id:0,user_id:0,__v:0})
.then((data)=>{
res.send({vendor_info:data});
})
.catch((err)=>{
res.send({err});
})
});
//{ $inc: { quantity: -2, "metrics.orders": 1 } }

module.exports=router;
