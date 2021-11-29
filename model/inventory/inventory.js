const mongoose = require('mongoose');

const inventory= new mongoose.Schema({
	product_id: {type: mongoose.Schema.ObjectId, required :true},
    product_quantity :  {type:Number,default:null,required :true},
    booked_product :{type:Number,default:0},
    sold_product: {type:Number,default:0},
    defected_product :{type:Number,default:null}
});

// collection creation
const model = mongoose.model('inventory',inventory);
module.exports = model;
