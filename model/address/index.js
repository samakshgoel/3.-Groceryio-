const addressModule = require('./address');

module.exports={

    async createAddress(data){
        return await addressModule(data).save();
    },

    async getAddress(data){
        return await addressModule.findOne({$and:[{user_id:data.user_id},
            {area:data.area},
            {flat_number:data.flat_number},
            {pincode:data.pincode},
            {address_type:data.address_type},
            {name:data.name},
            {mobile_number:data.mobile_number}
        ]})
    },

    async updateAddress(address_id,data){
        return await addressModule.updateOne({_id:address_id},{$set:data})
    },

    async removeAddress(address_id){
        return await addressModule.updateOne({_id:address_id},{$set:{is_remove:true}})
    },

    async getAllAddress(user_id){
        return await addressModule.find({user_id:user_id,is_remove:false})
    },

    async makeDefaultAddress(address_id){
        return await addressModule.findOneAndUpdate({_id:address_id,is_remove:false},{$set:{is_default:true}});
    },

    async getDefaultAddress(){
        return await addressModule.findOneAndUpdate({is_default:true},{$set:{is_default:false}})
    }
}
