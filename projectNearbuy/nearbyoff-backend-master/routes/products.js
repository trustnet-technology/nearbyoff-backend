const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const _ =require("lodash");
const express = require("express");
const router = express.Router();


router.post("/products", auth, async (req, res) => {
  let product= new Product({
    category: req.body.category,
    subcategory: req.body.subcategory,
    category_id: req.body.category_id,
    subcategory_id: req.body.subcategory_id,
    product_id: req.body.product_id,
    Price: req.body.price,
    product_desc: req.body.description,
    quantity: req.body.quantity,
    product_name: req.body.name,
    vendor_id: req.body.vendor_id,
  });
  product=await product.save().catch((e)=>{
    res.send(e);
  });
  const vendor=await Vendor.findOneAndUpdate({vendor_id: req.body.vendor_id},
      {$push: {products: req.body.product_id}},
      {useFindAndModify: false, new: true});
  res.send({"success": true, "message": "Product uploaded Successful",
    "vendor": _.pick(vendor, ["vendor_id"]),
    "product": _.pick(product, ["product_id"])});
});


router.put("/product_image", auth, async (req, res) => {
  const product = await Product.findOneAndUpdate(
      {product_id: req.body.product_id},
      {$set: {images: req.body.images}},
      {useFindAndModify: false, new: true});
  res.status(200).send({"product": _.pick(product, ["images", "vendor_id", "product_id"])});
});


router.get("/product_detail/:product_id", auth, async (req, res)=>{
  const product_id=req.params.product_id;
  const product= await Product.findOne({product_id: product_id}, {product_id: 0, _id: 0}).catch((e)=>{
    res.send(e);
  });
  res.send(product);
});


module.exports=router;
