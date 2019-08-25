const jwt =require("jsonwebtoken");

module.exports=function auth(req, res, next) {
  const token=req.header("x-auth-token");
  const decoded=jwt.verify(token, "secretkey");
  const isAdmin=decoded.isAdmin;
  if(!isAdmin) return res.status(401).send("Access denied. You are not an admin");
  try {
    
    next();
  } catch (ex) {
    res.status(400).send(ex);
  }
};