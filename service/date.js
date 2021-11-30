const {shipperAvailabilityModule} = require('../model');
const moment = require('moment')

module.exports = {

    async setNewAvailibility(month,year,shipper_id){

        let total_days = moment(year+"-"+month,"YYYY-MM").daysInMonth();
        let data = {
            shipper_id : shipper_id,
            month:month,
            year:year,
            availabilities:[]
        }
        console.log("month::",month, "year::",year)

        try{
            for(let d = 1; d<=total_days; d++){
                console.log("d",d)
                data.availabilities.push({ date:d+"-"+month+"-"+year, is_availaile:true})
            }
            let availability = await shipperAvailabilityModule.createAvailability(data);
            console.log("availabilityavailabilityavailability:::",availability)
            return availability;
        }catch(err){
            console.log(err); 
        }



    }
}