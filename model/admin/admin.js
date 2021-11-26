const mongoose = require('mongoose');


const admin= new mongoose.Schema({
	first_name: {type: String},
	last_name:{type: String},
	email: {type:String,required :true, unique:true},
	password :{type:String},
	mobile_number :{type:Number, required :true, unique:true}	
});

// collection creation
const model = mongoose.model('admin',admin);
module.exports = model;
