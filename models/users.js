const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        trim:true,
        unique:[true,'Email must be unique.'],
        minLength:[5,'Eamil must have atleast 5 character'],
        lowercase: true,
    },
    password:{
        type:String,
        required:[true, 'Password is required.'],
        trim:true,
        select:false,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    verification_code:{
        type:String,
        select:false,
    },
    verification_code_validation:{
        type:String,
        select:false,
    },
    forgot_password_code:{
        type:String,
        select:false,
    },
    forgot_password_code_validation:{
        type:String,
        select:false,
    },
},{
    timestamps:true
})

module.exports = mongoose.model("User",userSchema)