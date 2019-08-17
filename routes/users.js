const _ =require("lodash");
const bcrypt=require("bcryptjs");
const auth=require("../middleware/auth");
const {User, validate} = require("../models/user");
const {Vendor} = require("../models/vendor");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const paginate = require('express-paginate');

router.post("/signup", async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send({
   success:false,
   message:"User Already Registered." 
  });


  user=new User(_.pick(req.body, ["name", "email", "password"]));
  const salt=await bcrypt.genSalt(10);
  user.password =await bcrypt.hash(user.password, salt);

  await user.save();
  const token=user.generateAuthToken()
  res.header("x-auth-token", token).send({name:user.name,email:user.email,success:true});
});



router.post("/signin", async (req, res) => {
  const {error} = validatesignin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send({
  success:false,
  message:"Invalid Email"
});

  const validpassword=await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send({
    success:false,
    message:"Invalid Password"
  });
  var flag=await _.pick(user, ["isAdmin"]).isAdmin
  var regflag= await _.pick(user, ["isOnboarded"]).isOnboarded

  const token=user.generateAuthToken();
  res.send({token: token, message: "login Success",success:true,Admin:flag,Onboarded:regflag,vendor_id});
});

function validatesignin(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  };

  return Joi.validate(user, schema);
}



router.get('/all', async (req, res, next) => {
var query={}
query["name"] = 'aseem'
User.find(query).then((d)=>{
res.send(d)
}).catch((e)=>{
res.send(e)

})


})
 
router.get('/allusers', async (req, res, next) => {
 
  try {
 
    const [ results, itemCount ] = await Promise.all([
      User.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
      User.count({})
    ]);
    console.log(req.query);
    console.log(req.skip);

    const pageCount = Math.ceil(itemCount / req.query.limit);
 
    if (req.accepts('json')) {
     
      res.json({
        total_pages:pageCount,
        object: 'list',
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results
      });
    } else {
      res.render('users', {
        users: results,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
      });
    }
 
  } catch (err) {
    next(err);
  }
 
});

module.exports=router;
