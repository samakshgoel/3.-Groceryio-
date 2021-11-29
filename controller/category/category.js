const { categoryModule} = require('../../model');

module.exports ={
    async addCategory(req,res){
        let data = req.body;
        if(!data || !data.category_name || !data.category_type) return res.status(422).send({code:422,status:'failed',msg:'Data is missing!'});

        try{
            let categoryExist = await categoryModule.getCategory(data.category_name);
            categoryExist = JSON.parse(JSON.stringify(categoryExist));
            console.log("categoryEXist Data ",categoryExist);
            if(categoryExist){
                if(categoryExist.category_type == data.category_type &&categoryExist.parent_id == data.parent_id ) {
                    return res.send("Category with this name already exist");
                }
            }
            let category = await categoryModule.createCategory(data);
            return res.status(200).send({code:200,status:'success',data:category});
        }catch(err){
            console.log(err);
            return res.status(422).send({code:422,status:'failed',msg:err.message});
        }
    },
    async getParentsCategory(req,res){
        let parent_id = req.body.parent_id;
        let categoryList;
        try{
            if(!parent_id){
                categoryList = await categoryModule.getCategoryList();
            }else{    
                categoryList = await categoryModule.getChildCategoryList(parent_id);
            }

            return res.status(200).send({code:200,status:'success',data:categoryList});
        }catch(err){
            console.log(err);
            return res.status(422).send({code:422,status:'failed',msg:err.message})
        }
    }
}