const wishlistModule = require('./wishlist');
const {ObjectId} = require('bson');
module.exports ={

    async addToWishlist(data){
        return await wishlistModule(data).save()
    },

    async getWishlist(user_id,product_id){
        return await wishlistModule.findOne({user_id:ObjectId(user_id)},{products:{$elemMatch:{product_id:Object(product_id)}}})
    },

    async getWishlistProduct(){
        return await wishlistModule.findOneAndUpdate()
    },

    async addProductInWishlist(cartId,products){
        return await wishlistModule.findOneAndUpdate({_id:cartId},{$addToSet : {products:products}})
    },

    async increaseQuantity(cartId,product_id,quantity){
        console.log(cartId,product_id,quantity) 
        return await wishlistModule.findOneAndUpdate({_id:cartId, "products.product_id":product_id},{$set : {"products.$.quantity":quantity}})
    },

    async removeProduct(cartId,product_id){
        return await wishlistModule.updateOne({ _id: ObjectId(cartId) }, { $pull: { products: { product_id: product_id } } })
    },

    async wishlistDetails(user_id){
        return await wishlistModule.aggregate([
            {
                $match:{
                    user_id:ObjectId(user_id)
                }
            },
            {
                $unwind:"$products"
            },
            {
                $lookup:{
                    from:'products',
                    localField:'products.product_id',
                    foreignField:"_id",
                    as:"productsDetails"
                }
            },
            {
                $unwind:"$productsDetails"
            },
            {
                $group:
                    {
                    _id:'$_id',
                    "user_id":{ "$first": "$user_id" },
                    "is_in_cart":{ "$first": "$is_in_cart" },
                    'products':{
                        $push:{
                            "product_id":"$products.product_id",
                            "quantity":"$products.quantity",
                            "name":"$productsDetails.name",
                            "brand":"$productsDetails.brand",
                            "price":"$productsDetails.price",
                            "discount":"$productsDetails.discount",
                            "description":"$productsDetails.description",
                            "pack_size":"$productsDetails.pack_size",
                            "image":"$productsDetails.image",
                            "rating":"$productsDetails.rating",
                            "rating_count":"$productsDetails.rating_count",
                            "is_available":"$productsDetails.is_available",
                            "is_remove":"$productsDetails.is_remove"
                        }
                    }
                }
            }
        ])
    }

}