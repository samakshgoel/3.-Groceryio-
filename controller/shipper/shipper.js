const response = require('../../service/response');
const mailservice = require('../../service/otpandmail');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const { shipperModule, shipperAvailabilityModule } = require('../../model');
const orderModule = require('../../model/order/index')
const bcrypt = require('bcryptjs');
const moment = require('moment')
const getDateData = require('../../service/date');
const { getShipperOrderList } = require('../../model/order/index');

module.exports = {

    /*********ADMIN Related Methods*********** */
    async createShipper(req, res) {
        let data = req.body;
        if (!data.email || !data.email || !data.pincode || !data.mobile_number) return response.errorResponse(res, 422, "data is missing!!")

        try {
            let shipperExist = await shipperModule.getShipper(data.mobile_number, data.email)
            console.log("shipperExist::", shipperExist)
            if (shipperExist) {
                if (shipperExist.email == data.email) return response.errorResponse(res, 422, "Shipper exist with this email")
                if (shipperExist.mobile_number == data.mobile_number) return response.errorResponse(res, 422, "Shipper exist with this mobile_number")
            }
            data.password = await otpGenerator.generate(8, { upperCase: true, specialChars: true, alphabets: true, digits: true });
            let shipper = await shipperModule.createShipper(data);
            const sendCredentails = await mailservice.sendCredentiaToShipper(data.email, data.password);
            console.log("shipper created data :", sendCredentails);
            return response.succesResponse(res, 200, shipper);
        } catch (err) {
            console.log("error in create Shipper:", err);
            response.succesResponse(res, 422, err.message);
        }
    },

    async getallShipper(req, res) {
        let data = req.body;
        if (!data) return response.errorResponse(res, 422, "Data is missing!!")
        try {
            let shipperList = await shipperModule.getallShipper(data);
            console.log("shipperList:::", shipperList);
            return response.succesResponse(res, 200, shipperList);
        } catch (err) {
            console.log(err);
            return response.errorResponse(res, 422, err.message);
        }
    },

    async removeShipper(req, res) {
        let shipper_id = req.params.shipper_id;
        if (!shipper_id) return response.errorResponse(res, 422, "shipper_id is missing!!!");

        try {
            let removeData = await shipperModule.removeShipper(shipper_id);
            removeData.is_removed = true;
            console.log("removeData::", removeData)
            return response.succesResponse(res, 422, removeData);
        } catch (err) {
            console.log(err);
            return response.errorResponse(res, 422, err.message);
        }
    },

    async updateShipper(req, res) {
        let shipper_id = req.params.shipper_id;
        let data = req.body;
        if (!data) return response.errorResponse(res, 422, "Data is required.")
        if (!shipper_id) return response.errorResponse(res, 422, 'shipper_id is missing!')

        try {
            let updatedShipper = shipperModule.updateShipper(shipper_id, data);
            console.log("updatedShipper:::", updatedShipper)
        } catch (err) {
            console.log(err);
            return response.errorResponse(res, 422, err.message);
        }
    },

    async shipperOrderDetails(req,res){
        let data = req.body
        if(!data.shipper_id) return response.errorResponse(res,422,"Data is required")
        try{
            let shipper_order_details = await orderModule.getShipperOrderList(data.shipper_id)
            return response.succesResponse(res,200,shipper_order_details) 
        }catch(err){
            console.log("ERROR",err)
            return response.errorResponse(res,422,err.message)
        }
    },


    /*********SHIPPER Related Methods*********** */

    async login(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        if (!email || !password) return response.errorResponse(res, 422, "Credentials missing!!");

        try {
            let shipper = await shipperModule.getShipperByEmail(email);
            if (shipper.password != password) return response.errorResponse(res, 422, "Invalid Credentials")
            else {
                const payload = {
                    shipper_id: shipper._id,
                    shipper_email: shipper.email,
                }
                let token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '24h' });
                return response.succesResponse(res, 200, token);
            }
        } catch (err) {
            console.log(err);
            return response.errorResponse(res, 422, err.message);
        }
    },

    async updatePassword(req, res) {
        let data = req.body;
        let shipper_id = req.params.shipper_id;
        if (!shipper_id || !data) return response.errorResponse(res, 422, "Missing Data");

        try {
            let updatePassword = await shipperModule.updateShipper(shipper_id, data);
            updatePassword.password = data.password;
            return response.succesResponse(res, 200, updatePassword);
        } catch (err) {
            console.log(err);
            return response.errorResponse(res, 422, err.message);
        }
    },


    async setAvailability(req, res) {
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        if (!start_date || !end_date) return response.errorResponse(res, 422, 'Missing Attributes!!')
        start_date = start_date.split('-');
        end_date = end_date.split('-');
        console.log("start_date::", start_date, "end_date::", end_date);
        let result = [];
        try {
            let count = 0
            while (true) { 
                if(count > 30){
                    return response.errorResponse(res,422,"Unreachable Entity!!");
                }    
                result.push([])
                let total_days = await moment(`${start_date[2]}-${start_date[1]}`).daysInMonth();

                if (parseInt(start_date[1]) == parseInt(end_date[1]) && parseInt(start_date[2]) == parseInt(end_date[2])) {
                    total_days = end_date[0];
                }
                for (let i = parseInt(start_date[0]); i <= total_days; i++) {
                    
                    result[count].push({ date: i + "-" + start_date[1] + "-" + start_date[2], is_availaile: true })
                }

                if (parseInt(start_date[1]) == parseInt(end_date[1]) && parseInt(start_date[2]) == parseInt(end_date[2])) break

                if (start_date[1] > 11) {
                    start_date[2] = parseInt(start_date[2]) + 1;
                    start_date[1] = 1
                } else {
                    start_date[1] = parseInt(start_date[1]) + 1
                }
                if (start_date[1] < 10) {
                    start_date[1] = `0${start_date[1]}`
                }

                start_date[0] = 1
                count = count + 1
            }
            return res.send(result)
        } catch (err) {
            console.log('err in set Availability::', err)
        }


        // if(!data) return response.errorResponse(res,422,'Data is missing!!!');
        // console.log(data);
        // let current_date = moment().format('D');
        // let current_month = moment().format('MM');
        // let current_year = moment().format('YYYY') ;
        // let total_days =  moment(). daysInMonth();
        // noOfDays = total_days - current_date 
        // console.log("total_days:",current_month,"\n current_date:",current_date,"current_year",current_year);
        // try{
        //     let availabilityExist = await shipperAvailabilityModule.availabilityExist(data.shipper_id,current_month,current_year);
        //     if(availabilityExist) return response.errorResponse(res,422,"slot already exist for this shipper.");
        //     for(let d = current_date; d<=total_days; d++){
        //         data.availabilities.push({ date:d+"-"+current_month+"-"+current_year, is_availaile:true})
        //     }
        //     let availability = await shipperAvailabilityModule.createAvailability(data);
        //     return res.send(availability)
        // }catch(err){
        //     console.log(err);
        // }

        // let current_date = new Date();
        // current_date.setDate(current_date.getDate() + 13);
        // return res.send(current_date);


    },

    async applyLeaves(req, res) {
        let shipper_id = req.params.shipper_id;
        let date = req.body.date;
        if (!shipper_id || !date) return response.errorResponse(res, 422, "Data is missing!");
        date = moment(date).format('D-MM-YYYY');
        modified_date = date.split('-');
        let month = modified_date[1]
        let year = modified_date[2];
        console.log("Date.dateDate.dateDate.date", date)
        // let 

        try {
            let availabilityExist = await shipperAvailabilityModule.availabilityExist(shipper_id, month, year);
            console.log("availabilityExist:::::::::", availabilityExist)
            if (!availabilityExist) await getDateData.setNewAvailibility(month, year, shipper_id);
            // Data.date = moment(Data.date).format('D-MM-YYYY');
            // console.log("Date.dateDate.dateDate.date",Data.date)
            let dateExist = await shipperAvailabilityModule.applyLeaves(shipper_id, date);
            console.log("dateExist:::", dateExist);
            return res.send(dateExist);
        } catch (err) {
            console.log(err);
            return response.errorResponse(res, 422, err.message);
        }

    },



    async test(req,res){
        let shipper_id = req.body.shipper_id;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        if (!start_date || !end_date) return response.errorResponse(res, 422, 'Missing Attributes!!')
        start_date = start_date.split('-');
        end_date = end_date.split('-');
        console.log("start_date::", start_date, "end_date::", end_date);
        let result = [];
        try {
            let count = 0
            while (true) { 
                if(count > 30){
                    return response.errorResponse(res,422,"Unreachable Entity!!");
                }    
                // result.push([])
                result.push({})
                result[count].month = start_date[1];
                result[count].year = start_date[2];
                result[count].shipper_id = shipper_id;
                result[count].availabilities = [];

                let total_days = await moment(`${start_date[2]}-${start_date[1]}`).daysInMonth();

                if (parseInt(start_date[1]) == parseInt(end_date[1]) && parseInt(start_date[2]) == parseInt(end_date[2])) {
                    total_days = end_date[0];
                }
                for (let i = parseInt(start_date[0]); i <= total_days; i++) {
                    
                    // result[count].push({ date: i + "-" + start_date[1] + "-" + start_date[2], is_availaile: true })
                    result[count].availabilities.push({ date: i + "-" + start_date[1] + "-" + start_date[2], is_availaile: true })

                }
                
                if (parseInt(start_date[1]) == parseInt(end_date[1]) && parseInt(start_date[2]) == parseInt(end_date[2])) break

                if (start_date[1] > 11) {
                    start_date[2] = parseInt(start_date[2]) + 1;
                    start_date[1] = 1
                } else {
                    start_date[1] = parseInt(start_date[1]) + 1
                }
                if (start_date[1] < 10) {
                    start_date[1] = `0${start_date[1]}`
                }

                start_date[0] = 1
                count = count + 1
            }
            return res.send(result)
        } catch (err) {
            console.log('err in set Availability::', err)
        }
    }

}