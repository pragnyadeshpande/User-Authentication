const nodemailer=require('nodemailer')

const trans=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.NODE_SENDING_EMAIL,
        pass:process.env.NODE_EMAIL_PASSWORD
    }
})
module.exports=trans