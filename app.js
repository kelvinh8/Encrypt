require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
})
app.get("/register",function(req,res){
  res.render("register");
})
app.post("/register",(req,res)=>{
  const user = new User({
    email:req.body.username,
    password:md5(req.body.password)
  })
  user.save(err=>{
    if(err){
      res.send(err)
    }else{
      res.render("login")
    }
  })
})
app.get("/login",function(req,res){
  res.render("login");
})
app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email:username},(err,foundUser)=>{
    if(err){
      console.log(err)
    }else{
      if(foundUser.password === password){
        res.render("secrets")
      }
    }
  })
})
app.listen(3000,function(req,res){
  console.log("Server started on port 3000")
})
