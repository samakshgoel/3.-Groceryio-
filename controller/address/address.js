const response = require('../../service/response');
const addressModule = require('../../model/address');

module.exports={

    /*Method for creating address */
    async addAddress(req,res){
        let data = req.body;
        if(!data.mobile_number || !data.name || !data.user_id || !data.area || !data.pincode || !data.address_type ||!data.flat_number) return response.errorResponse(res,422,'Data is missing');

        try{
            let addressExist = await addressModule.getAddress(data);
            if(addressExist) return response.errorResponse(res,422,"Address already!");
            let address = await addressModule.createAddress(data);
            console.log("address created :",address);
            return response.succesResponse(res,200,address);

        }catch(err){
            console.log("error in create address API:",err);
            return response.errorResponse(res,422,err.message);
        }
    },

    async updateAddress(req,res){
        let address_id = req.params.address_id;
        console.log(user_id)
       let data = req.body;
       if(!data) return response.errorResponse(res,422,'Data is missig!')
       
       try{
            let updateData = await addressModule.updateAddress(address_id,data);
            console.log("updateData::",updateData)
            return response.succesResponse(res,200,updateData);
       }catch(err){
           console.log("error in update address :",err);
           return response.errorResponse(res,422,err.message)
       }
    },

    async removeAddress(req,res){
        let address_id = req.params.address_id;
        if(!address_id) return response.errorResponse(res,422,'Addess Id is missing!');

        try{
            let removeData = addressModule.removeAddress(address_id);
            console.log("removeData ::",removeData)
            return response.succesResponse(res,200,removeData);
        }catch(err){
            console.log("error in remove Address :",err);
            return response.errorResponse(res,422,err.message)
        }
    },

    async getAllAddress(req,res){
        let user_id = req.params.user_id;
        if(!user_id) return response.errorResponse(res,422,"user_id is missing!");

        try{
            let addressList = await addressModule.getAllAddress(user_id);
            return response.succesResponse(res,200,addressList);
        }catch(err){
            console.log("error in get all Address :",err);
            return response.errorResponse(res,422,err.message)
        }
    },

    async makeDefaultAddress(req,res){
        let address_id = req.params.address_id;
        if(!address_id) return response.errorResponse(res,422,"address_id is missing!");

        try{
            let defaultExist = await addressModule.getDefaultAddress(address_id);
            console.log("defaultExist:::",defaultExist);
            let address = await addressModule.makeDefaultAddress(address_id)
            address.is_default = true;
            return response.succesResponse(res,200,address);
        }catch(err){
            console.log("error in make Default Address :",err);
            return response.errorResponse(res,422,err.message)
        }
    }
}