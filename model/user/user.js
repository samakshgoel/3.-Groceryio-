const mongoose = require('mongoose');


const user= new mongoose.Schema({
	name: {type: String,required :true},
	email: {type:String,required :true, unique:true},
	mobile_number :{type:String, required :true, unique:true},
	otp:{type:String, default: null},
    age : {type :Number},
    gender : {type: String},
    address_id :{type: String, default:null}

});

// collection creation
const model = mongoose.model('user',user);
module.exports = model;
