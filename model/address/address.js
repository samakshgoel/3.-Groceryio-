const mongoose = require('mongoose');

const address= new mongoose.Schema({
	user_id: {type: mongoose.Schema.ObjectId, required :true},
    flat_number :  {type:Number,default:null},
    street_number: {type:Number,default:null},
    area :{type:String,default:""},
    landmark : {type:String ,default:""},
    pincode : {type:Number,required :true},
    city: {type:String,required :true},
    state:{type:String,required :true},
    address_type:{type:String,default:""},
    is_remove:{type:Boolean, default:false},
    name:{type:String,default : null,required :true},
    is_default:{type:Boolean, default:false},
    mobile_number:{type:String,default:null,required :true}
});

// collection creation
const model = mongoose.model('address',address);
module.exports = model;
