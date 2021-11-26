const mongoose = require('mongoose');

const shipper= new mongoose.Schema({
	name: {type: String,required:true},
	email: {type:String,required :true, unique:true},
	password :{type:String,default:null},
    pincode:{type:Number,required :true},
	mobile_number :{type:Number,required:true},
	is_removed:{type:Boolean,default:false},
	created_at:	{type:Date,default:Date.now()},
	removed_at:	{type:Date,default:null},
	modified_at:{type:Date,default:null},
	active_status:{type:Boolean, default: false}
});

// collection creation
const model = mongoose.model('shipper',shipper);
module.exports = model;
