const {createHmac}=require('crypto')
const {hash,compare}=require('bcryptjs')
exports.dohash=(value,salt)=>{
    result=hash(value,salt)
    return result
}

exports.dohashvalidation= (value,hashvalue)=>{
    const result=compare(value,hashvalue)
    return result
}

exports.hmacprocess=(value,key)=>{
    const result=createHmac('sha256',key).update(value).digest('hex')
    return result
}