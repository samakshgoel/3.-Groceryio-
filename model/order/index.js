const orderModule = require('./order');

module.exports={

    async orderCreate(data){
        return await orderModule(data).save();
    },

    async cancelOrder(order_id){
        return await orderModule.findOneAndUpdate({_id:order_id},{$set:{is_cancel:true, canceled_at:Date.now()}})
    },

    async orderdelivered(order_id){
        return await orderModule.findOneAndUpdate({_id:order_id},{$set:{is_delievered:true,order_status:"done",payment_done:true}})
    },

    async orderHistory(user_id){
        return await orderModule.find({user_id:user_id})
    },

    async getShipperOrderList(id){
        return await orderModule.findOne({"shipper_details.shipper_id":id,"shipper_details.is_accepted":true})
    },
    async orderStatus(order_id,shipper_id,status){
        return await orderModule.findOneAndUpdate({_id:order_id, 'shipper_details.shipper_id':shipper_id},{$set:{'shipper_details.$.is_accepted':status}})
    },

    async addShipper(order_id,shipper_details){
        return await orderModule.updateOne({_id:order_id},{$addToSet : {shipper_details:shipper_details}})
    }//{$addToSet : {Users:Users}}
}