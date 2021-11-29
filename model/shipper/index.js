const shipperModule = require('./shipper');

module.exports={

    async createShipper(data){
        return await shipperModule(data).save();
    },

    async getShipper(mobile_number,email){
        return await shipperModule.findOne({$or:[{mobile_number:mobile_number},{email:email}]});
    },

    async getallShipper(data){
        return await shipperModule.find({$and :[{name : new RegExp(data.name,'i')}, {is_remove:{$ne:true}}]}).skip(data.skip).limit(data.limit);
    },

    async removeShipper(shipper_id){
        return await shipperModule.findOneAndUpdate({_id:shipper_id},{$set:{is_removed:true, removed_at:Date.now()}})
    },

    async updateShipper(shipper_id,data){
        return await shipperModule.findOneAndUpdate({_id:shipper_id},{$set:data})
    },

    async getShipperByEmail(email){
        return await shipperModule.findOne({email:email});
    },

    async shipperByPincode(pincode,date){
        console.log("pincode is ",pincode,"  datedate:::",date)
        return await shipperModule.aggregate([
            {
                $match:{pincode:pincode, is_removed:false}
            },
            {
                $lookup: {
                    from: 'shipper_availabilities',
                    localField: '_id',
                    foreignField: 'shipper_id',
                    as: 'data'
                }
            },
            {$unwind:"$data"},
            {$unwind:"$data.availabilities"},
            {$project:{
                _id:1,
                name:1,
                pincode:1,
                date_availabilities:{
                    $cond:[{ "$and": [ 
                        { $eq: [ "$data.availabilities.date", date ] },
                        { "$lt": [ "$data.availabilities.delivery_quantity", 11 ] },
                        { $eq: [ "$data.availabilities.is_availaile", true ] }
                    ]},
                    "$data.availabilities.date",
                    "$availabilities.date"
                    ]
                },
                delivery_quantity:"$data.availabilities.delivery_quantity",
            }},
            {
                $match:{date_availabilities:date} 
            },
            { $sort : { delivery_quantity:1 } }
        ]);
    },


}