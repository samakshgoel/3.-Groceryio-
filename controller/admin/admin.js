const bcrypt = require('bcryptjs');
const {adminModule,userModule, shipperModule} = require('../../model');
const jwt = require('jsonwebtoken');
const response = require('../../service/response');
const roles = require('../../service/roles');
module.exports = {

    /*Admin signup */
    async signUp(req,res){
        let data = req.body;
        if(!data.password || !data.email || !data.first_name || !data.last_name) return response.errorResponse(res,422,'Data is missing!')

        try{
            let alreadyUser = await adminModule.getAdmin(data.email);
            if(alreadyUser) return response.errorResponse(res,422,'User Already exist!')

            data.password = bcrypt.hashSync(data.password,10);
            let saveAdmin = await adminModule.saveAdmin(data);

            const payload = {
                user_id : saveAdmin._id,
                email: saveAdmin.email,
                roles:'Admin'
            }
            let token = jwt.sign(payload,process.env.JWT_KEY,{expiresIn:'24h'});

            return res.status(200).send({code:200,status:'sucess', data:token})
            
        }catch(err){
            console.log("error in signing admin is ",err);
            return response.errorResponse(res,422,err.message)
        }
    },

    /*Admin login */
    async login(req,res){
        let data = req.body;
    
        if(!data.password || !data.email ) return response.errorResponse(res,422,'Data is missing!')

        try{
            let isUser = await adminModule.getAdmin(data.email);
            let verifyPassword = await  bcrypt.compare(data.password,isUser.password)
            
            if(isUser){
                if(verifyPassword){
                    payload = {
                        _id : isUser._id,
                        email: isUser.email,
                        roles: roles.Admin
                    }
                    let token = jwt.sign(payload,process.env.JWT_KEY,{expiresIn:'24h'});
                    return res.status(200).send({code:200,status:'success', data:token})
                }else{
                    return response.errorResponse(res,422,'Wrong Password')
                }
            }else{
                return response.errorResponse(res,422,'please sign up first')
            }
        }catch(err){
            console.log("error in login admin ",err)
            return response.errorResponse(res,422,err.message)
        }
    },

    async allUser(req,res){
        let data = req.body;
        if(!data) return response.errorResponse(res,422,"Data is missing")
        try{
            let usersList = await userModule.getAllUserForAdmin(data);
            return response.succesResponse(res,200,usersList);
        }catch(err){
            console.log(err);
            return response.errorResponse(res,422,err.message)
        }
    },
    // async allShiper(req,res){
    //    let data = req.body
    //    if(!data) return response.errorResponse(res,422,"Data is missing")
    //    try{
    //      let list = await shipperModule.getallShipper() 
    //    }catch(err){
    //        console.log("Error's occuring while getting shipper's list ")
    //        return response.errorResponse(res,422,err.message)
    //    }
    // }
}