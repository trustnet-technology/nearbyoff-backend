const _ =require("lodash");
var multer  = require('multer');
var AWS = require('aws-sdk');

const {Vendor} = require("../models/vendor");
const {Product} = require("../models/product");
const {Inventory} = require("../models/inventory");
const {User} = require("../models/user");

const auth=require("../middleware/auth");
const queue=require("../middleware/queue");
const express = require("express");
const router = express.Router();
const jwt=require("jsonwebtoken");

var googleMapsClient = require('@google/maps').createClient({
  key:'AIzaSyCPq73ZhDozL2oRl9jfqO_4xZpBMOCJA84'
});


router.post("/register", auth, async (req, res) => {
  var lat="";
  var lng="";

  const token=req.header("x-auth-token");
  const decoded=jwt.verify(token, "secretkey");
  var Vendor_Id=String(decoded._id)+String(Date.now())
  
  googleMapsClient.geocode({
  address:req.body.Address1 +" "+req.body.Address2+" "+req.body.Address3}, async function(err, response) 
    {
    if (!err) 
    {
    lat=String(response.json.results[0].geometry.location.lat);
    lng=String(response.json.results[0].geometry.location.lng);
  
  const vendor= new Vendor({
    vendor_id: Vendor_Id,
    user_id: decoded._id,
    category: req.body.category,
    contact_no: req.body.contact_no,
    Address: {
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      Address3: req.body.Address3,
    },
    vendor_name: req.body.vendor_name,
    coord:{lat:lat,lng:lng}
    
  });
  await vendor.save().catch((e)=>{
    res.send(e);
  });
  await User.findOneAndUpdate({_id:decoded._id},
    {$set: {vendor_id: Vendor_Id}})


    
  res.send({vendor,Success:true});
    }
    else{
     
  const vendor= new Vendor({
    vendor_id: Vendor_Id,
    user_id: decoded._id,
    category: req.body.category,
    contact_no: req.body.contact_no,
    Address: {
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      Address3: req.body.Address3,
    },
    vendor_name: req.body.vendor_name,
    coord:{lat:lat,lng:lng}
    
  });
  await vendor.save().catch((e)=>{
    res.send(e);
  });
  await User.findOneAndUpdate({_id:decoded._id},
    {$set: {vendor_id: Vendor_Id}})

    
res.send({vendor,Success:true});

    }
    
  });
  
});







router.put("/onboarding", auth, async (req, res) => {
  const token=req.header("x-auth-token");
  const decoded=jwt.verify(token, "secretkey");
  if (!(String(req.body.vendor_id).substring(0, 24)==String(decoded._id))) {
    return res.send({message: "invalid request user not matched"});
  }
  const vendor=await Vendor.findOneAndUpdate({vendor_id: req.body.vendor_id},
      {$set:
      {
      shop_desc: req.body.shop_desc, 
      shop_name: req.body.shop_name,
      shop_images:req.body.shop_images,
      operating_hrs: { opening_time: req.body.opening_time, closing_time: req.body.closing_time},
    }},
      {useFindAndModify: false, new: true});
      
  await User.findOneAndUpdate({_id:decoded._id}, {$set: {isOnboarded:true }});
  
  await queue({body:JSON.stringify({
    sellerId:req.body.vendor_id,
    openingHour:req.body.opening_time,
    closingHour:req.body.closing_time,
    modifiedDate:String(Date.now()),
    }),accountId:'524486326329',queueName:'NearbyOff_Addvendor_Queue'})
  
  
  res.send({vendor,Success:true});
});

router.post("/geocoding", async (req, res) => {
googleMapsClient.geocode({
  address:req.body.Address1+" "+req.body.Address2+" "+req.body.Address3}, async function(err, response) 
  {
  if (!err) 
  {
    var lat=String(response.json.results[0].geometry.location.lat);
    var lng=String(response.json.results[0].geometry.location.lng);
    res.send({lat,lng,Success:true});
    
  }
  else
  {
    res.send({Success:false,Error:err})
  }
});
});




router.put("/onboarding_images", auth, async (req, res) => {
  const vendor=await Vendor.findOneAndUpdate({vendor_id: req.body.vendor_id},
      {$push: {category_images: req.body.category_image, shop_images: req.body.shop_image}}
      ,{new: true});
  res.send({vendor,Success:true});
});





router.get("/allproducts/:vendor_id",auth,async (req, res) => {
  

let products=await Inventory.aggregate([
  { "$match": { "vendor_id": req.params.vendor_id }},
  { 
      "$lookup": 
      { 
          "from": 'products', 
          "localField": 'product_id', 
          "foreignField": 'product_id', 
          "as": 'Products' 
      } 
  } 

])
res.send(products)


});

// router.get("/products/:vendor_id", auth, async (req, res) => {
//   Product.aggregate([
//     {$match: {vendor_id: req.params.vendor_id}},
//     {$group: {
//       _id: "$category", prices: {$push: "$Price"},quantities:{$push:'$quantity'},Names:{$push:'$product_name'}}},
//   ]).then((d)=>{
//     res.send(d);
//   });
// });

router.get("/info/:vendor_id", auth, async (req, res) => {
Vendor.findOne({vendor_id:req.params.vendor_id},{products:0,vendor_id:0,_id:0,user_id:0,__v:0})
.then((data)=>{
res.send({vendor_info:data});
})
.catch((err)=>{
res.send({err});
})
});

router.get("/check_main_vendor/:vendor_id", auth, async (req, res) => {
  Vendor.findOne({vendor_id:req.params.vendor_id},{is_main_vendor:1})
  .then((data)=>{
  res.send({vendor_info:data});
  })
  .catch((err)=>{
  res.send({err});
  })
  });

  var storage = multer.memoryStorage({
      destination: function(req, file, callback) {
          callback(null, '');
      }
  });
  
  var multipleUpload = multer({ storage: storage }).array('file');
  
  
  router.post('/upload',multipleUpload,auth, async(req, res)=> {
  const file = req.files;
    
    let s3bucket = new AWS.S3({
      accessKeyId: "AKIAXUHOSHA44HHJ5JBE",
      secretAccessKey: "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",
      Bucket: 'com.file.upload'
    });
   
  var ResponseData = [];
     
  file.map((item) => {
        var params = {
          Bucket: 'com.file.upload',
          Key: "folder/"+Date.now()+item.originalname,
          Body: item.buffer,
          ACL: 'public-read'
      
    };
    
    s3bucket.upload(params, function (err, data) {
          if (err) {
           res.json({ "success": false, "Message": err});
          }
          else{
              ResponseData.push(data.Location);
              if(ResponseData.length == file.length){
                res.send({ "success": true, "Message": "File Uploaded", Data: ResponseData});
              }
            }
         });
       });
     
  });


module.exports=router;



//http://localhost:3000/v1/api/vendors/allproducts/5d2c2ed714272f2cb442d0ea1563909781740
//NearbyOff_AddProductSeller_Queue
