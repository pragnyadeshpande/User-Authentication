const { signupSchema } = require("../middlewares/validator");
const User = require('../models/users');
const { dohash } = require("../utils/hashing");

exports.signUp=async(req,res)=>{
    const {email,password}=req.body
    try{
        const {err,value}=signupSchema.validate({email,password})
        if(err){
            return res.status(401).json({success:false,message:err.details[0].message})
        }
        const existsuser=await User.findOne({email})
        if(existsuser){
            return res.status(401).json({success:false, message:"User already exists"})
        }
        const hashedpass=await dohash(password,12)
        
        const newUser=new User({
            email,
            password:hashedpass,
        })
        const result=await newUser.save()
        result.password=undefined
        res.status(201).json({success:true, message: "Your account has been created.", result})
    }catch(err){
        console.log(err);
    }
    res.json({'message':'Signup success'})
}