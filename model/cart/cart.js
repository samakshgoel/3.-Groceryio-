const mongoose = require('mongoose');

let product_schema = new mongoose.Schema({
    product_id : { type : mongoose.Schema.ObjectId},
    quantity :{type:Number,default:1}
})

const cart= new mongoose.Schema({
	user_id: {type: mongoose.Schema.ObjectId, required :true},
    products : [product_schema],
    is_in_cart:{type:Boolean, default:true},
});

// collection creation
const model = mongoose.model('cart',cart);
module.exports = model;
