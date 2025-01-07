const {hash}=require('bcryptjs')
exports.dohash=(value,salt)=>{
    result=hash(value,salt)
    return result
}