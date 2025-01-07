require('dotenv').config();

const express = require('express');
const helmet =require('helmet');
const cors = require('cors');
const cookie = require('cookie-parser');
const mongoose=require('mongoose');
const authRouter=require('./routers/authRouter')

const app=express()

app.use(cors())
app.use(helmet())
app.use(cookie())
app.use(express.json())
app.use(express.urlencoded({extented:true}))

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database connected.")
}).catch((err)=>{
    console.log(err);
})
app.use('/api/auth',authRouter)

app.get('/',(req,res)=>{
    res.json({'message':'Server is up and running'});
})


app.listen(process.env.PORT,()=>{
    console.log("Listening...")
})