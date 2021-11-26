const mongoose = require('mongoose');

const category= new mongoose.Schema({
	parent_id: {type: mongoose.Schema.ObjectId, default : null},
    category_name : {type:String, required:true},
    category_type:{type:String,default:'child'},
    is_remove :{type:String,default:false}
});

// collection creation
const model = mongoose.model('category',category);
module.exports = model;
