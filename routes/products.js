const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const {Category} = require("../models/category");
const {Variant} = require("../models/variant");
const {Inventory} = require("../models/inventory");
const {City} = require("../models/city");
const _ =require("lodash");
const express = require("express");
const router = express.Router();


router.post("/products", auth, async (req, res) => {
  let inventory=await Inventory.findOne({
    vendor_id:req.body.vendor_id,
    product_variant_id: req.body.product_variant_id,
    product_id:req.body.product_id})
  if(inventory)
  {
    inventory = await Inventory.findOneAndUpdate(
      {product_variant_id: req.body.product_variant_id,
      product_id: req.body.product_id
      ,vendor_id:req.body.vendor_id
      },
      {$inc:{ unapproved_quantity: req.body.quantity}},
      {useFindAndModify: false, new: true});
  res.status(200).send({inventory,message:"success",success:true});

  }
  else{
let product= new Product({
    category: req.body.category,
    subcategory: req.body.subcategory,
    category_id: req.body.category_id,
    subcategory_id: req.body.subcategory_id,
    product_id:req.body.product_id,
    is_main_vendor:true,
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
  selling_price:req.body.selling_price,
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
  product_id:req.body.product_id,
  is_main_vendor:true,
  unapproved_quantity:0,
  approved_quantity:req.body.quantity
})

await inventory.save()
res.send({message:"product succesfully uploaded",product,variant,inventory})
  }
});


router.get("/city",async(req,res)=>{
await City.find({}).then((cities)=>{
res.send(cities)
})
})


router.get("/variant/:product_id/:product_variant_id",auth,async(req,res)=>{
await Variant.findOne({product_variant_id:req.params.product_variant_id,
  product_id:req.params.product_id}).then((product)=>{
  res.send(product)
  })
  })


router.post("/addinventory", auth, async (req, res) => {
  let inventory=await Inventory.findOne({vendor_id:req.body.vendor_id,product_variant_id: req.body.product_variant_id,product_id:req.body.product_id})
  if(inventory)
  {
   
    inventory = await Inventory.findOneAndUpdate(
      {product_variant_id: req.body.product_variant_id,
      product_id: req.body.product_id
      ,vendor_id:req.body.vendor_id
      },
      {$inc:{ unapproved_quantity: req.body.quantity}},
      {useFindAndModify: false, new: true});
  res.status(200).send({inventory,message:"success",success:true});
}
else
{
let inventory=new Inventory({
    vendor_id:req.body.vendor_id,
    product_variant_id:req.body.product_variant_id,
    product_id:req.body.product_id,
    approved_quantity:0,
    is_main_vendor:false,
    unapproved_quantity:req.body.quantity
  })

  await inventory.save()
  res.status(200).send({inventory,message:"success",success:true});

}
});

  



router.put("/buy", auth, async (req, res) => {
  let inventory=Inventory.findOne({vendor_id:req.body.vendor_id,product_variant_id: req.body.product_variant_id,product_id:req.body.product_id})
  inventory = await Inventory.findOneAndUpdate(
        {product_variant_id: req.body.product_variant_id},
        {$inc:{ approved_quantity:-1*(req.body.quantity)}},
        {useFindAndModify: false, new: true});
    res.status(200).send({inventory,message:"success",success:true});
  });
  

router.put("/product_image", auth, async (req, res) => {
  const product = await Product.findOneAndUpdate(
      {product_id: req.body.product_id},
      
      {$push: {images: req.body.image}}, 
      {useFindAndModify: false, new: true});
  res.status(200).send({"product": _.pick(product, ["images", "vendor_id", "product_id"])});
});


router.get("/product_detail/:product_variant_id/:product_id", auth, async (req, res)=>{
 
  const product_variant_id=req.params.product_variant_id;
  const product_id=req.params.product_id;
  const variant= await Variant.findOne({product_variant_id: product_variant_id,product_id: product_id});
  res.send(variant);
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
  Category.find({category:req.params.category},{subcategory:1,_id:0}).then((data)=>{
    res.send(data)
  })

});






router.get("/subcategory_mainvendor/:category", auth, async (req, res)=>{
  Category.distinct("subcategory",{category:req.params.category})
  .then((d)=>{
  res.send(d)
}).catch((e)=>{
  res.send(e)
})
});



router.get("/subcategory_data/:subcategory", auth, async (req, res)=>{
  Category.findOne({subcategory:req.params.subcategory},{category:0,_id:0}).then((data)=>{
    res.send(data)
  })

});




module.exports=router;
