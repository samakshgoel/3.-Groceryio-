const categoryModel = require('./category');

module.exports = {

    /*Method for adding category */
    async createCategory(data){
        return await categoryModel(data).save(); 
    },

    async getCategory(category_name){
        return await categoryModel.findOne({category_name:category_name})
    }, 

    async getCategoryList(){
        return await categoryModel.find({category_type:'parent', is_remove:false});
    },

    async getChildCategoryList(parent_id){
        return await categoryModel.find({category_type:'child',parent_id:parent_id,is_remove:true});
    }
}