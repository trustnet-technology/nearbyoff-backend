const {City} = require("../models/city");
const _ =require("lodash");
const express = require("express");
const router = express.Router();


router.post('/save', async(req,res)=>{
 

const city=new City({
city_name:req.body.city_name,
city_id:req.body.city_id,
state:req.body.state,
})    
await city.save();
res.send('city saved');

});
    








module.exports=router;