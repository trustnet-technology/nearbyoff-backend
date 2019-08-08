const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const {Category} = require("../models/category");
const {Variant} = require("../models/variant");
const {Inventory} = require("../models/inventory");
const _ =require("lodash");
const express = require("express");
const router = express.Router();


router.post("/products", auth, async (req, res) => {
 var vendor=await Vendor.findOne({vendor_id:req.body.vendor_id});
 var is_main_vendor=vendor.is_main_vendor; 
  
let product= new Product({
    category: req.body.category,
    subcategory: req.body.subcategory,
    category_id: req.body.category_id,
    subcategory_id: req.body.subcategory_id,
    product_id:req.body.product_id,
    is_main_vendor:is_main_vendor,
    product_name:req.body.product_name,
    brand_name:req.body.brand_name,
    product_desc:req.body.product_desc,
    images:req.body.images,
    city:req.body.city,
    title:String(req.body.product_name)+String(req.body.brand_name),
    vendor_id:req.body.vendor_id
  });
  await product.save();
 
let variant= new Variant({
  product_id:req.body.product_id,
  product_variant_id:req.body.product_variant_id,
  MRP:req.body.MRP,
  Selling_price:req.body.Selling_price,
})
  if(req.body.weight)
  variant.weight=req.body.weight

  if(req.body.size)
  variant.size=req.body.size

  if(req.body.color)
  variant.color=req.body.color

  await variant.save();

  let inventory=new Inventory({
  vendor_id:req.body.vendor_id,
  product_variant_id:req.body.product_variant_id,
  is_approved:is_main_vendor,
  quantity:req.body.quantity
})

await inventory.save()
res.send({message:"product succesfully uploaded",product,variant,inventory})
});


router.put("/inventory", auth, async (req, res) => {
let inventory=Inventory.findOne({product_variant_id: req.body.product_variant_id})
let quantity=inventory.quantity;

   inventory = await Inventory.findOneAndUpdate(
      {product_variant_id: req.body.product_variant_id},
      {$set: {is_approved:false,quantity:quantity}},
      
      {useFindAndModify: false, new: true});
  res.status(200).send({inventory,message:"success",success:true});
});


router.put("/product_image", auth, async (req, res) => {
  const product = await Product.findOneAndUpdate(
      {product_id: req.body.product_id},
      //{$set: {images: req.body.images}},
      {$push: {images: req.body.image}}, 
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


router.get("/allcategory", auth, async (req, res)=>{
 Category.distinct("category")
   .then((d)=>{
   res.send(d)
 }).catch((e)=>{
   res.send(e)
 })
});


router.get("/subcategory/:category", auth, async (req, res)=>{
  Category.find({category:req.params.category},{subcategory:1})

});



router.get("/subcategory_data/:subcategory", auth, async (req, res)=>{
  Category.find({subcategory:req.params.subcategory},{category:0})

});
 
module.exports=router;
