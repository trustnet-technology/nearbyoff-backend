const {Category} = require("../models/category");
const _ =require("lodash");
const express = require("express");
const router = express.Router();


router.post('/save', async(req,res)=>{
 

const category=new Category({
category:req.body.category,
subcategory:req.body.subcategory,
categoryid:String(req.body.category).substring(0,4),
subcategoryid:String(req.body.subcategory).substring(0,4)
})    


if(req.body.weight)
category.weight=req.body.weight

if(req.body.color)
category.color=req.body.color

if(req.body.size)
category.size=req.body.size

await category.save();
res.send('category saved');


});
    

router.get('/all',async(req,res)=>{

Category.find({}).then((d)=>{
    res.send(d)
})

})








module.exports=router;