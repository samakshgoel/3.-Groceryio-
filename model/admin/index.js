const adminModel = require('./admin');

module.exports = {

    /*Method for saving admin details */
    async saveAdmin(data){
        return await adminModel(data).save();
    },

    /*Method for getting admin details */
    async getAdmin(email){
        return await adminModel.findOne({email:email});
    }
    
}