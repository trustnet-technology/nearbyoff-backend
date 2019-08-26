const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const admin_middleware=require("../middleware/admin");
const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const {Inventory} = require("../models/inventory");
const _ =require("lodash");
const queue=require("../middleware/queue");
const express = require("express");
const router = express.Router();

router.put('/approve_vendor/:vendor_id',auth,admin_middleware ,async(req,res)=>{
let vendor=await Vendor.findOne({vendor_id:req.params.vendor_id});   

let d=await Vendor.findOneAndUpdate({vendor_id:req.params.vendor_id},{$set:{is_approved:req.body.action}},
{useFindAndModify: false, new: true})

await queue({body:JSON.stringify({
	sellerId: vendor.vendor_id,
	contactNumber: vendor.contact_no,
	openingHour: vendor.opening_time,
	closingHour: vendor.closing_time,
	sellerName:vendor.vendor_name,
	pincode: "",
	profileImage: "img.png",
	address: vendor.Address.Address1,
	createdDate: Date.now(),
	modifiedDate: Date.now(),
}),accountId:'524486326329',queueName:'NearbyOff_Addvendor_Queue'})

res.send({d});

});
    

router.put('/approve_product',auth,admin_middleware ,async(req,res)=>{
let inventory=await Inventory.findOne({
    product_variant_id:req.body.product_variant_id,
    product_id:req.body.product_id,
    vendor_id:req.body.vendor_id    
})

await Inventory.findOneAndUpdate({
    product_variant_id:req.body.product_variant_id,
    product_id:req.body.product_id,
    vendor_id:req.body.vendor_id    
},
{
$set: { unapproved_quantity: 0 }, 
$inc: { approved_quantity:req.body.unapproved_quantity} 
},
{useFindAndModify: false, new: true});


await queue({body:JSON.stringify({
productAttributeId:req.body.product_variant_id,
sellerId: req.body.vendor_id,
count:req.body.unapproved_quantity+inventory.approved_quantity,
modifiedDate: Date.now(),
}),accountId:'524486326329',queueName:'NearbyOff_AddProductSeller_Queue'})
    
    
res.send({message:"success"});

});


router.get('/unapproved_vendors',auth,admin_middleware ,async(req,res)=>{
Vendor.find({is_approved:0})
.then((d)=>{
res.send(d)  
}).catch((e)=>{
res.send(e);
})
});

router.get('/unapproved_products',auth,admin_middleware,async(req,res)=>{

    let products=await Inventory.aggregate([
        { "$match": { unapproved_quantity: { $gt:0}}},
        { 
            "$lookup": 
            { 
                "from": 'products', 
                "localField": 'product_id', 
                "foreignField": 'product_id', 
                "as": 'Products' 
            } 
        },
        
      ])

      res.send(products)
});


router.get('/',auth,admin_middleware ,async(req,res)=>{
res.send("Congrats you are an admin");
});



module.exports=router;
