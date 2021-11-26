const mongoose = require('mongoose');

const payment= new mongoose.Schema({
	user_id: {type: mongoose.Schema.ObjectId, required :true},
	created_at: {type:Date, default : Date.now()},
    amount : {type:Number,required:true},
    payment_status :{type:Boolean, default :true},
    payment_type:{type:String,default :'cash'},
});

// collection creation
const model = mongoose.model('payment',payment);
module.exports = model;
