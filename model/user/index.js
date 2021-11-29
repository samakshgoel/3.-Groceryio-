const userModel = require('./user');

module.exports = {

    /*Method for saving user details */
    async saveUser(data){
        return await userModel(data).save();
    },

    /*Method for getting user details */
    async getUser(data){
        return await userModel.findOne(data);
    },

    /*Method to update user data */
    async updateUser(data){
        return await userModel.updateOne(data);
    },

    async getAllUserForAdmin(data){
        return await userModel.find({name : new RegExp(data.name,'i')}).skip(data.skip).limit(data.limit)
    }
    
}