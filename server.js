const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const vendors = require("./routes/vendors");
const threads = require("./routes/threads");
const users = require("./routes/users");
const city = require("./routes/cities");
const category = require("./routes/categories");
const leads = require("./routes/leads");
const orders = require("./routes/orders");
const validity = require("./routes/validity");
const posts = require("./routes/posts");
const admin = require("./routes/admin");
const products = require("./routes/products");
const app = express();
const queue=require("./middleware/queue");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const RateLimit = require("express-rate-limit");
const paginate = require('express-paginate');
app.use(paginate.middleware(10, 50));


mongoose.connect("mongodb+srv://aseem7570:aseem@123@cluster0-fxsdz.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true

})
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB..."));

app.listen(3000, () => console.log("Connected on port 3000!"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  next();
});
app.enable("trust proxy");

const apiLimiter = new RateLimit({
  windowMs: 15*60*1000,
  max: 100,
});


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/v1/api/vendors", vendors, apiLimiter);
app.use("/v1/api/threads", threads, apiLimiter);
app.use("/v1/api/admin", admin, apiLimiter);
app.use("/v1/api/users", users, apiLimiter);
app.use("/v1/api/posts", posts, apiLimiter);
app.use("/v1/api/leads", leads, apiLimiter);
app.use("/v1/api/orders", orders, apiLimiter);
app.use("/v1/api/products", products, apiLimiter);
app.use("/v1/api/validity", validity, apiLimiter);
app.use("/v1/api/city", city, apiLimiter);
app.use("/v1/api/category", category, apiLimiter);

app.get("/", apiLimiter, function(req, res) {
  res.send({title: "Home Page"});
});


