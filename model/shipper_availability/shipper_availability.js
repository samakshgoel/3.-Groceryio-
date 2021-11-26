const mongoose = require('mongoose');
const moment = require('moment')

const availability_date = new mongoose.Schema({
    date:{type:String,required:true},
    is_availaile:{type:Boolean,default :true},
    delivery_quantity :{type:Number,default:0},
})

const shipper_availability = new mongoose.Schema({
    shipper_id : {type:mongoose.Schema.ObjectId, required:true},
    month : {type:Number , default :moment().format('MM') },
    year : {type:Number, default : moment().format('YYYY')},
    availabilities : [availability_date]

})

const model = mongoose.model('shipper_availability',shipper_availability);
module.exports = model;

