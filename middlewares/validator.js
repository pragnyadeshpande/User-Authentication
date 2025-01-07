const Joi=require('joi')

exports.signupSchema=Joi.object({
    email:Joi.string().min(6).max(60).required().email({
        tlds:{allow:['com','net']}
    }),
    password:Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')),
})