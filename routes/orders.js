const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const admin_middleware=require("../middleware/admin");
const {Vendor} = require("../models/vendor");
const {Order} = require("../models/order");
const {Product} = require("../models/product");
const {Inventory} = require("../models/inventory");
const _ =require("lodash");
const express = require("express");
const router = express.Router();



router.post('/generate', async(req,res)=>{
let product=await Product.findOne({product_id:req.body.product_id});
let vendor=await Vendor.findOne({vendor_id_id:req.body.vendor_id});
vendor=vendor.vendor_name;
const order= new Order({
vendor_id:req.body.vendor_id,
product_variant_id:req.body.product_variant_id,
contact_no :req.body.contact_no,
quantity:req.body.quantity,
product_name:req.body.product_name,
product_desc:req.body.product_desc,
customer_name:req.body.customer_name,
vendor_name:vendor,
product_price:req.body.product_price,
date:Date.now(),
Address:req.body.Address
});
await order.save()

await Inventory.findOneAndUpdate({vendor_id:req.body.vendor_id,product_variant_id:req.body.product_variant_id},
{$inc:{approved_quantity:-(req.body.quantity)}},
{useFindAndModify: false, new: true})

res.send({order,message:"success"})
});
 



router.get('/vendor/:vendor_id',auth, async(req,res)=>{
Lead.find({vendor_id:req.params.vendor_id},{__v:0}).then((data)=>{
res.send({leads:data})
}).catch((err)=>{
res.send(err)
})
})

router.put('/add_comment/:lead_id',auth,async(req,res)=>{
if(req.body.comment&&req.body.result)
{
Lead.findOneAndUpdate({_id:req.params.lead_id},{$set:{comment:req.body.comment,result:req.body.result}},
{useFindAndModify: false, new: true}).then((d)=>{
res.send(d)  
}).catch((e)=>
{res.send(e);
})
}
else if(!req.body.comment)
{
  Lead.findOneAndUpdate({_id:req.params.lead_id},{$set:{result:req.body.result}},
    {useFindAndModify: false, new: true}).then((d)=>{
    res.send(d)  
    }).catch((e)=>
    {res.send(e);
    })
}
else if(!req.body.result)
{
  Lead.findOneAndUpdate({_id:req.params.lead_id},{$set:{comment:req.body.comment}},
    {useFindAndModify: false, new: true}).then((d)=>{
    res.send(d)  
    }).catch((e)=>
    {res.send(e);
    })
}

});
    


router.get('/admin',auth,admin_middleware, async(req,res)=>{
Lead.aggregate([{$group:{_id: "$vendor_id",count:{$sum:1},vendor:{$last:"$vendor_name"},Name:{$push:"$product_name"},Customers:{$push:"$customer_name"}}}
]).then((d)=>{
res.send(d);
});
})


router.get('/admin_wise',auth,admin_middleware, async(req,res)=>{
Lead.aggregate([
{$match:{date:{$gte:req.query.date1,$lte:req.query.date2}}},    
{$group:{_id: "$date",count:{$sum:1}}}
]).then((d)=>{
res.send(d);
});
})

router.get('/vendor_wise/:vendor_id',auth,async(req,res)=>{
Lead.aggregate([
    { 
      $match: {
           $and: [ 
               {date:{$gte:req.query.date1,$lte:req.query.date2}},
               {vendor_id: {$eq:req.params.vendor_id}}, 
               ]
      }

    },
    {$group:{_id: "$date",count:{$sum:1}}}

   ]).then((d)=>{
res.send(d);
});
})
    



module.exports=router;