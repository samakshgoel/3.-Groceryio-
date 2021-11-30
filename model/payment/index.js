const paymentModule = require('./payment');

module.exports ={

    async createPayment(data){
        return await paymentModule(data).save();
    },

    async paymentHistory(user_id){
        return await paymentModule.find({user_id:user_id})
    }
}