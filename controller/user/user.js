const services = require('../../service/otpandmail');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_SID
const client = require('twilio')(accountSid, authToken,serviceId);
const {userModule} = require('../../model');
module.exports = {


  async signUp(req,res){
    let data = req.body;
    if(!data || !data.first_name || !data.last_name) return res.status(422).send({code:422,status:'failed',msg:'data is missing'});

    try{
      let userExist = await userModule.getUser({email:data.email});
      if(userExist) return res.status(422).send({code:422,status:'failed',msg:'Already exist'});
      let user = await userModule.saveUser(data);
      payload = {
        user_id : user._id,
        email: user.email,
      }
      let token = jwt.sign(payload,process.env.JWT_KEY,{expiresIn:'24h'});
      return res.status(200).send({code:200,status:'success',data:token});
    }catch(err){
      console.log(err);
      return res.status(422).send({code:422,status:'failed',msg:err.message});
    }
  },

  async loginWithOtp(req,res){
    data = req.body;
    if(!data) return res.status(422).send({code:422,status:'failed',msg:'Data is required'})
    if(!data.loginType) return res.status(422).send({code:422,status:'failed',msg:'loginType is required'})
    try{
      if(data.loginType == 'mobile_number'){
        let mobile_number = data.mobile_number
        let userExist = await userModule.getUser({mobile_number:data.mobile_number})
        if(!userExist) return res.status(422).send({code:422,status:'failed',msg:"Account doesn't exist from this number"})
        let verificationCode = await services.mobileOtp(mobile_number)
        if(verificationCode.status != "pending"){
          return res.status(422).send({code:422,status:'failed',msg:"Something went wrong"});
        }
        console.log("verificationCode",verificationCode);
      }else if(data.loginType == 'email'){
        let email = data.email 
        let userExist = await userModule.getUser({email:email})
        console.log("user Exist in login with otp api",userExist);
        if(!userExist) return res.status(422).send({code:422,status:'failed',msg:"Account doesn't exist from this email"})
        const mail = services.emailOtp(email);
        if(!mail){
          return res.status(422).send({code:422,status:'failed',msg:"Something went wrong"});
        }
      }
      console.log("yessssssssssssss")
      return res.status(200).send({code:200,status:'success',msg:"OTP sent successfully."})
      
    }catch(err){
      console.log(err)
    }
  },

  async verifyOtp(req, res){
    data = req.body;
    if(!data) return res.status(422).send({code:422,status:'failed',msg:'Data is missing.'})

    try{
      if(data.loginType == 'mobile_number'){
        let mobile_number = data.mobile_number;
        let otp = data.otp;
        let verification = await services.verifyMobileOtp(mobile_number,otp);
        if(verification.status== "approved"){
          let user = await userModule.getUser({mobile_number:data.mobile_number})
          let payload = {
            user_id : user._id,
            mobile_number: user.mobile_number,
          }
          let token = jwt.sign(payload,process.env.JWT_KEY,{expiresIn:'24h'});
          return res.status(200).send({code:200,status:'success',data:token});
        }
        return res.status(422).send({code:422,status:'failed',msg:'Something went wrong!!'})
      }else if(data.loginType == 'email'){
        let email = data.email;
        let otp = data.otp;

        let user = await userModule.getUser({email:email});
        if(otp==user.otp){
          let payload = {
            user_id : user._id,
            email: user.email,
          }
          let token = jwt.sign(payload,process.env.JWT_KEY,{expiresIn:'24h'});
          return res.status(200).send({code:200,status:'success',data:token});
        }else{
          return res.status(422).send({code:422,status:'failed',msg:'Incorrect OTP!!'})
        }
      }
    }catch(err){
      return res.status(422).send({code:422,status:'failed',msg:err.message});
    }

   
  },
      
}