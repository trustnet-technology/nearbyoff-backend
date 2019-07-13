const _ =require("lodash");
const bcrypt=require("bcrypt");
const auth=require("../middleware/auth");
const {User, validate} = require("../models/user");
const {Vendor} = require("../models/vendor");
const Joi = require("joi");
const express = require("express");
const router = express.Router();


router.post("/signup", async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send("User already registered.");


  user=new User(_.pick(req.body, ["name", "email", "password"]));
  const salt=await bcrypt.genSalt(10);
  user.password =await bcrypt.hash(user.password, salt);

  await user.save();
  const token=user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
});



router.post("/signin", async (req, res) => {
  const {error} = validatesignin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send("invalid email or password");

  const validpassword=await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("invalid email or password");
  
  //var count=Vendor.find({vendor_id://i})



  const token=user.generateAuthToken();
  res.send({token: token, message: "success login",flag:flag});
});

function validatesignin(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  };

  return Joi.validate(user, schema);
}


module.exports=router;
