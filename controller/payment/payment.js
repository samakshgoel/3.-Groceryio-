const response = require('../../service/response');
const {paymentModule} = require('../../model')

module.exports = {

    async makePayment(req,res){
        let data = req.body;
        if(!data || !data.amount) return response.errorResponse(res,422,"Missing Data");

        try{
            let payment = await paymentModule.createPayment(data);
            console.log('payment in makepayment API:',payment)
            return response.succesResponse(res,422,payment);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    },

    async paymentHistory(req,res){
        let user_id = req.body.user_id;
        if(!user_id) return response.errorResponse(res,422,"user_id");

        try{
            let paymentList = await paymentModule.paymentHistory(user_id);
            console.log("paymentList::",paymentList);
            return response.succesResponse(res,200,paymentList);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    }
}
