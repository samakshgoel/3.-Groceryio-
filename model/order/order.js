const mongoose = require('mongoose');
const moment = require('moment');

const product_schema = new mongoose.Schema({
    product_id:{type: mongoose.Schema.ObjectId, required :true},
    quantity : {type:Number,required :true},
})

const shipper_schema = new mongoose.Schema({
    shipper_id:{type: mongoose.Schema.ObjectId, required :true},
    is_accepted : {type:Boolean,default : null},
})

const order= new mongoose.Schema({
	user_id: {type: mongoose.Schema.ObjectId, required :true},
	product_details:[product_schema],
	order_date: {type:Date, default : Date.now()},
	delievery_date: {type:String, required:true},
	payment_id :{type: mongoose.Schema.ObjectId, required :true},
    payment_done : {type :Boolean,default:false},
    address_id: {type:mongoose.Schema.ObjectId, required :true},
    is_delievered:{type:Boolean, default : false},
    order_status:{type:String},
    shipper_details:[shipper_schema],
    is_cancel : {type:Boolean , default:false},
    canceled_at:{type:Date,default:null},
    created_at:{type:Date,default:Date.now()},

});

// collection creation
const model = mongoose.model('order',order);
module.exports = model;
