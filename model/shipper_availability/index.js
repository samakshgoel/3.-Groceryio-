const shipperAvailabilityModule = require('./shipper_availability');
const {ObjectId} = require('bson')
module.exports = {

    async createAvailability(data){
        return await shipperAvailabilityModule(data).save();
    },

    async setAvailability(id,availability_date){
        return await shipperAvailabilityModule.updateOne({_id:id},{$addToSet : { availabilities:availability_date }});
    },


    async availabilityExist(shipper_id,month,year){
        return await shipperAvailabilityModule.findOne({shipper_id:shipper_id,month:month,year:year})
    },

    async applyLeaves(shipper_id,date){
        return await shipperAvailabilityModule.updateOne({shipper_id:shipper_id,  'availabilities.date':date},{$set:{'availabilities.$.is_availaile':false}})
    },

    async updateDeliveryQuantity(shipper_id,date,delivery_quantity){
        return await shipperAvailabilityModule.updateOne({shipper_id:shipper_id,'availabilities.date':date},{$set:{'availabilities.$.delivery_quantity':delivery_quantity}})
    },

    async shipperQuantityDetails(shipper_id, date){
        return await shipperAvailabilityModule.findOne({shipper_id: shipper_id},{availabilities: {$elemMatch: {date:date}}})
        //
        // {shipper_id:shipper_id,'availabilities.date':date}
    }
}