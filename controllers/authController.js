const { expression } = require("joi");
const { signupSchema, signinSchema } = require("../middlewares/validator");
const User = require('../models/users');
const { dohash, dohashvalidation, hmacprocess } = require("../utils/hashing");
const jwt=require('jsonwebtoken');
const trans = require("../middlewares/sendmail");

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

exports.signIn=async(req,res)=>{
    const {email,password}=req.body
    try{
        const {err,value}=signinSchema.validate({email,password})
        if(err){
            return res.status(401).json({success:false,message:err.details.message[0]})
        }
        const existsuser=await User.findOne({email}).select('+password')
        if(!existsuser){
            res.status(401).json({success:false,message:"User does not exist."})
        }
        const pass=await dohashvalidation(password,existsuser.password)
        if(!pass){
            res.status(401).json({success:false,message:"Invalid credentials"})
        }
        const token=jwt.sign({
                userId: existsuser.id,
                email: existsuser.email,
                verified: existsuser.verified,
            }, 
            process.env.TOKEN_SECRET,
            {
                expiresIn: '8h'
            }
        )
        res.cookie('Authorisation','Bearer'+token, {expires:new Date(Date.now()+8*3600000),
            httpOnly:process.env.NODE_ENV==='production',
            secure:process.env.NODE_ENV==='production'}).json({success:true,token,message:'Login Successful'})
    }catch(err){
        console.log(err)
    }

}

exports.signOut=async(req,res)=>{
    res.clearCookier('Authorization').status(200).json({success:true,message:"You have sucessfully signed out."})
}

exports.sendverificationcode=async(req,res)=>{
    const {email}=req.body
    try{
        const existsuser=await User.findOne({email})
        if(!existsuser){
            return res.status(404).json({message:"User does not exist."})
        }
        if(existsuser.verified){
            return res.status(400).json({message:"You are already verified."})
        }
        const codeval=Math.floor(Math.random()*100000).toString()
        let info=await trans.sendMail({
            from: process.env.NODE_SENDING_EMAIL,
            to: existsuser.email,
            subject:"Verification code.",
            html:'<h1>'+codeval+'</h1>',
        })
        if(info.accepted[0]===existsuser.email){
            const hashedcode=hmacprocess(codeval,process.env.HMAC_SECRET)
            existsuser.verification_code=hashedcode,
            existsuser.verification_code_validation=Date.now()
            await existsuser.save()
            return res.status(200).json({success:true,message:"Code sent"})
        }
        return res.status(400).json({success:true,message:"Code sent failed."})
    }catch(err){
        console.log(err)
    }
}