const response = require('../../service/response');
const wishlistModule = require('../../model/wishlist');

module.exports={

    async addProduct(req,res){
        let data= req.body;
        if(!data.user_id || !data.products) return response.errorResponse(res,422,"Data attributes are missing!")
        let wishlistData = []
        try{
            let wishlistExist = await wishlistModule.getWishlist(data.user_id,data.products[0].product_id);
            console.log("cart EXist data : ",wishlistExist);
            if(wishlistExist){
                if(wishlistExist.products.length){
                    //update quantity of product
                    wishlistData = await wishlistModule.increaseQuantity(wishlistExist._id,wishlistExist.products[0].product_id,data.products[0].quantity);
                    // wishlistData.products[]
                }else{
                    // add new product in the cart
                    wishlistData = await wishlistModule.addProductInWishlist(wishlistExist._id,data.products)
                }
            }else{
            wishlistData = await wishlistModule.addToWishlist(data)
            }
            return response.succesResponse(res,200,wishlistData);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message)
        }
    },


    async removeProduct(req,res){
        let data = req.body;
        if(!data || !data.cartId || !data.product_id) return response.errorResponse(res,422,"Data is missing!!");
        try{
            let removeWishlist = await wishlistModule.removeProduct(data.cartId,data.product_id)
            console.log("removeWishlist :: ",removeWishlist)
            return response.succesResponse(res,200,"removed successfully!")
        }catch(err){
            console.log(err);
            response.errorResponse(res,422,"Data is missing!!");
        }
    },

    async getWishlist(req,res){
        let user_id = req.params.user_id;
        if(!user_id) return response.errorResponse(res,422,"user_id is missing!");

        try{
            let wishlistData = await wishlistModule.wishlistDetails(user_id);
            console.log("card data wiith full product details: ",wishlistData);
            return res.send(wishlistData)
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    }
}