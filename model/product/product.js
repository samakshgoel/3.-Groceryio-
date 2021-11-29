const mongoose = require('mongoose');


const product= new mongoose.Schema({
	category_id: {type: mongoose.Schema.ObjectId, required :true},
	name: {type:String, required :true},
	brand :{type:String, required :true},
	price :{type:Number, required :true},
    discount : {type :String},
    description : {type: String, required :true},
    pack_size:{type:String, required :true},
    image :{type: String, default:null},
    rating : {type:String,default : '0'},
    rating_count: {type:Number, default : null},
    is_available :{type:Boolean, default : true},
    is_remove : {type:Boolean , default:false},
    added_by:{type: mongoose.Schema.ObjectId, required :true}
});

// collection creation
const model = mongoose.model('product',product);
module.exports = model;
