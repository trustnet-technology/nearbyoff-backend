const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const admin_middleware=require("../middleware/admin");
const {Vendor} = require("../models/vendor");
const {Order} = require("../models/order");
const {Product} = require("../models/product");
const {Inventory} = require("../models/inventory");
const queue=require('../middleware/queue')
const _ =require("lodash");
const express = require("express");
const router = express.Router();



router.post('/generate', async(req,res)=>{

const order= new Order({
order_id:req.body.order_id,  
vendor_id:req.body.vendor_id,
user_id:req.body.user_id,
product_variant_id:req.body.product_variant_id,
product_id:req.body.product_id,
contact_no :req.body.contact_no,
quantity:req.body.quantity,
product_name:req.body.product_name,
product_desc:req.body.product_desc,
customer_name:req.body.customer_name,
vendor_name:req.body.vendor_name,
payment_method:req.body.payment_method,
product_price:req.body.product_price,
status:"order placed",
date:Date.now(),
Address:req.body.Address
});
await order.save()

res.send({order,message:"success"})

});

router.put('/update',auth ,async(req,res)=>{
let order =await Order.findOneAndUpdate({order_id:req.body.order_id},{$set:{status:req.body.status}})

  await queue({body:JSON.stringify({
  userOrderId: req.body.order_id,
  userId: req.body.user_id,  
  statue: req.body.status,
  }),accountId:'524486326329',queueName:'NearbyOff_UpdateOrderWebsite_Queue'})
  
  res.send({message:true,order})

})



router.get('/vendor/:vendor_id',auth, async(req,res)=>{
Order.find({vendor_id:req.params.vendor_id},{__v:0}).then((data)=>{
res.send({orders:data})
}).catch((err)=>{
res.send(err)
})
})

router.put('/add_comment/:order_id',auth,async(req,res)=>{
if(req.body.comment&&req.body.result)
{
Order.findOneAndUpdate({_id:req.params.order_id},{$set:{comment:req.body.comment,result:req.body.result}},
{useFindAndModify: false, new: true}).then((d)=>{
res.send(d)  
}).catch((e)=>
{res.send(e);
})
}
else if(!req.body.comment)
{
  Order.findOneAndUpdate({_id:req.params.order_id},{$set:{result:req.body.result}},
    {useFindAndModify: false, new: true}).then((d)=>{
    res.send(d)  
    }).catch((e)=>
    {res.send(e);
    })
}
else if(!req.body.result)
{
  Order.findOneAndUpdate({_id:req.params.order_id},{$set:{comment:req.body.comment}},
    {useFindAndModify: false, new: true}).then((d)=>{
    res.send(d)  
    }).catch((e)=>
    {res.send(e);
    })
}

});
    


router.get('/admin',auth,admin_middleware, async(req,res)=>{
Order.aggregate([{$group:{_id: "$vendor_id",count:{$sum:1},vendor:{$last:"$vendor_name"},Name:{$push:"$product_name"},Customers:{$push:"$customer_name"}}}
]).then((d)=>{
res.send(d);
});
})


router.get('/admin_wise',auth,admin_middleware, async(req,res)=>{
Order.aggregate([
{$match:{date:{$gte:req.query.date1,$lte:req.query.date2}}},    
{$group:{_id: "$date",count:{$sum:1}}}
]).then((d)=>{
res.send(d);
});
})

router.get('/vendor_wise/:vendor_id',auth,async(req,res)=>{
Order.aggregate([
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