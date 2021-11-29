const response = require('../../service/response');
const {productModule} = require('../../model')
const firebaseService = require('../../service/firebasee');
const fs = require('fs')

module.exports = {

    async addProduct(req,res){
        console.log(req.file)
        const path = req.file.path
        
        req.body = JSON.parse(JSON.stringify(req.body))
        let data = req.body;
        console.log("datatata",req.body)
        if( !data.category_id || !data.name || !data.brand || !data.pack_size) return response.errorResponse(res,422,"Data is missing");

        try{
            let isProductExist = await productModule.getOneProduct(data);
            console.log("is prodiuct exist ", isProductExist);
            if(isProductExist){
                removeImage(path);
                return response.succesResponse(res,422,"product already added!")
            } 
            const image = await firebaseService.getUrl(path,"Profile Image");
            data.image = image;
            let product = await productModule.createProduct(data);
            console.log("product adding :",path);
            removeImage(path);
            return response.succesResponse(res,200,product); 
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    },

    async getProducts(req,res){
        let category_id = req.params.category_id;
        let name = req.body.name;
        let skip = req.body.skip;
        let limit = req.body.limit;
        console.log(category_id)
        if(!category_id) return response.errorResponse(res,422,"category id is missing !");
        try{
            let products = await productModule.getAllProducts(name,category_id,skip,limit);
            return response.succesResponse(res,200,products);
        }catch(err){
            return response.errorResponse(res,422,err.message);
        }
    },

    async removeProduct(req,res){
        let product_id = req.params.product_id;
        if(!product_id) return response.errorResponse(res,422,"product_id id is missing !");

        try{
            let productRemove = await productModule.removeProduct(product_id);
            console.log("prooduct that was remove: ", productRemove);
            return response.succesResponse(res,200,productRemove);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }


    }
}

 function removeImage(path){
    if(path){
        fs.unlink(path, function(err){
            if(err) console.log("error in deleting file!",err)
        })
    }
}