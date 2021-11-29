const inventoryModule = require('./inventory');

module.exports={

    async createInventory(data){
        return await inventoryModule(data).save();
    },

    async getInventory(product_id){
        return await inventoryModule.findOne({product_id:product_id});
    },

    async increaseInventoryQuantity(product_id,product_quantity){
        return await inventoryModule.findOneAndUpdate({product_id:product_id},{$set:{product_quantity:product_quantity}})

    },

    async inventoryDetails(){
        return await inventoryModule.aggregate([
            {
                $lookup:{
                    from:'products',
                    localField:'product_id',
                    foreignField:"_id",
                    as:"productsDetails"
                }
            },
            {$unwind:"$productsDetails"},
            {
                $project:{
                    product_id:1,
                    product_quantity:1,
                    sold_product:1,
                    instock_product:1,
                    defected_product:1,
                    category_id:'$productsDetails.category_id',
                    name:'$productsDetails.name',
                    brand:"$productsDetails.brand",
                    price:"$productsDetails.price",
                    description:'$productsDetails.description',
                    pack_size:'$productsDetails.pack_size',
                    image:"$productsDetails.image",
                    rating:'$productsDetails.rating',
                    rating_count:'$productsDetails.rating_count',
                    added_by:'$productsDetails.added_by',
                    is_remove:'$productsDetails.is_remove'
                }
            }
        ])
    },

    async updateInventory(product_id,data){
        return await inventoryModule.findOneAndUpdate({product_id:product_id},{$set:data});
    }

}