const mongoose = require('mongoose');

const reviews= new mongoose.Schema({
	user_id: {type: mongoose.Schema.ObjectId, required :true},
    product_id: {type: mongoose.Schema.ObjectId, required :true},
    review :{type:String}
    
});

// collection creation
const model = mongoose.model('reviews',reviews);
module.exports = model;
