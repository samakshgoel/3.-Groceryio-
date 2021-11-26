const response = require('../../service/response');
const {orderModule, inventoryModule, shipperModule, shipperAvailabilityModule} = require('../../model');
const moment = require('moment')
module.exports = {

    async createOrder(req,res){
        let data = req.body;
        if(!data) return response.errorResponse(res,422,'Missing Data!!');

        let extened_date = 3;
        let shipper = []
        
        try{
            while(true){
                let current_date = new Date();
                current_date.setDate(current_date.getDate() + extened_date);
                data.delievery_date = moment(current_date).format('D-MM-YYYY');
                console.log(data.delievery_date);

                shipper = await shipperModule.shipperByPincode(data.pincode, data.delievery_date);
                if(shipper.length != 0) break
                console.log("shipper::::",shipper);

                extened_date = extened_date + 1;
            }
            console.log("shipper222222::::",shipper);
            // data.shipper_details = [{shipper_id:shipper[0]._id}]
            // console.log("data.shipper_details",data.shipper_details)
        
            
            // let order = await orderModule.orderCreate(data);
            // console.log("Created order::",order);
            // order.product_details.map(async (element) => {
            //     let getInventory = await inventoryModule.getInventory(element.product_id);
            //     let updated_booked_product = getInventory.booked_product + element.quantity;
            //     let updateInventory = await inventoryModule.updateInventory(element.product_id,{booked_product:updated_booked_product})
            //     console.log("updateInventory result is :",updateInventory);
            // });
            
            return response.succesResponse(res,200,shipper);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    },


    async cancelOrder(req,res){
        let order_id = req.params.order_id;
        let is_defective = req.body.is_defective;
        if(!order_id) return response.errorResponse(res,422,'Missing attributes');

        try{
            let orderCancel = await orderModule.cancelOrder(order_id);

            orderCancel.product_details.map(async(element)=>{
                let getInventoryDetails = await inventoryModule.getInventory(element.product_id);
                let updated_booked_product = getInventoryDetails.booked_product -element.quantity;
                if(is_defective){
                    let updated_defected_product = getInventoryDetails.defected_product + element.quantity;
                    inventoryModule.updateInventory(element.product_id ,{   booked_product:updated_booked_product,  defected_product:updated_defected_product  }) 
                }else{
                    inventoryModule.updateInventory(element.product_id,{booked_product:updated_booked_product}) 
                }
            })
            return response.succesResponse(res,200,'Order Cancel successfully');
        }catch(err){
            console.log('error in cancel order id ::',err.message);
            return response.errorResponse(res,422,err.message);
        }
    },

    async orderdelivered(req,res){
        let order_id = req.params.order_id;
        if(!order_id) return response.errorResponse(res,422,'credentials are missing!');

        try{
            let orderDelivered = await orderModule.orderdelivered(order_id);
            console.log("order delivered successfully ::",orderDelivered)

            orderDelivered.product_details.map(async(element)=>{
                let inventoryDetails = await inventoryModule.getInventory(element.product_id);
                console.log('inventoryDetails::::',inventoryDetails);
                let updated_booked_product = inventoryDetails.booked_product - element.quantity;
                let updated_sold_product = inventoryDetails.sold_product + element.quantity;
                inventoryModule.updateInventory(element.product_id,{  booked_product:updated_booked_product,  sold_product:updated_sold_product})
            })
            return response.succesResponse(res,200,"Order delivered successfully")
            
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message);
        }
    }, 

    async orderHistory(req,res){
     let user_id = req.body.user_id;
     if(!user_id) return response.errorResponse(res,422,"user_id is missing!")
     
     try{
        let orders = await orderModule.orderHistory(user_id);
        console.log("orders list API:::",orders);
        return response.succesResponse(res,200,orders);

     }catch(err){
         return response.errorResponse(res,422,err.message);
     }
    }
}