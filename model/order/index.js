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
    }
}