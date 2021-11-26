const response = require('../../service/response');
const inventoryModule = require('../../model/inventory');

module.exports={

    async addInInventory(req,res){
        let data= req.body;
        if(!data.product_id || !data.product_quantity) return response.errorResponse(res,422,"Data is missing!");
        let inventoryData = []
        try{
            let inventoryExist = await inventoryModule.getInventory(data.product_id);
            if(inventoryExist){
                // update inventory data
                data.product_quantity = data.product_quantity + inventoryExist.product_quantity;
                inventoryData = await inventoryModule.increaseInventoryQuantity(inventoryExist.product_id,data.product_quantity);
                inventoryData = JSON.parse(JSON.stringify(inventoryData));
                inventoryData.product_quantity = data.product_quantity
            }else{
                // create inventory data
                inventoryData =await inventoryModule.createInventory(data);
            }
            console.log("inventoryData:::",inventoryData)
            return response.succesResponse(res,200,inventoryData);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }

    },

    async inventoryList(req,res){
        
        try{
            let inventoryList = await inventoryModule.inventoryDetails()
            return response.succesResponse(res,200,inventoryList);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    }
}