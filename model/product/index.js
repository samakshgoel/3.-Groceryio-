const productModule = require('./product');

module.exports ={

    /*Method for Creating Product */
    async createProduct(data){
        return await productModule(data).save();
    },

    async getOneProduct(data){
        return await productModule.findOne({name:data.name,
            category_id:data.category_id,
            brand:data.brand,
            pack_size:data.pack_size,
            is_remove:false
        })
    },

    async getAllProducts(name,category_id,skip,limit){
        return await productModule.find({$and :[{name : new RegExp(name,'i')},{category_id:category_id}, {is_remove:{$ne:true}}]}).skip(skip).limit(limit)
    },

    async removeProduct(product_id){
        return await productModule.findOneAndUpdate({_id:product_id},{$set:{is_remove:true}})
    }
}