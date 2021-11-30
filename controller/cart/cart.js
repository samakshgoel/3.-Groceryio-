const response = require('../../service/response');
const cartModule = require('../../model/cart');

module.exports = {

    async addProduct(req,res){
        let data= req.body;
        if(!data.user_id || !data.products) return response.errorResponse(res,422,"Data attributes are missing!")
        let cartData = []
        try{
            let cartExist = await cartModule.getCart(data.user_id,data.products[0].product_id);
            console.log("cart EXist data : ",cartExist);
            if(cartExist){
                if(cartExist.products.length){
                    //update quantity of product
                    cartData = await cartModule.increaseQuantity(cartExist._id,cartExist.products[0].product_id,data.products[0].quantity);
                    // cartData.products[]
                }else{
                    // add new product in the cart
                    cartData = await cartModule.addProductInCart(cartExist._id,data.products)
                }
            }else{
            cartData = await cartModule.addToCart(data)
            }
            return response.succesResponse(res,200,cartData);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message)
        }

    },

    async removeProduct(req,res){
        let data = req.body;
        if(!data || !data.cartId || !data.product_id) return response.errorResponse(res,422,"Data is missing!!");
        try{
            let removecart = await cartModule.removeProduct(data.cartId,data.product_id)
            console.log("removecart :: ",removecart)
            return response.succesResponse(res,200,"removed successfully!")
        }catch(err){
            console.log(err);
            response.errorResponse(res,422,"Data is missing!!");
        }
    },

    async getCart(req,res){
        let user_id = req.params.user_id;
        if(!user_id) return response.errorResponse(res,422,"user_id is missing!");

        try{
            let cartData = await cartModule.cartDetails(user_id);
            console.log("card data wiith full product details: ",cartData);
            return res.send(cartData)
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    }
}