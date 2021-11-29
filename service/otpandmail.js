const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_SECRET_KEY);
const otpGenerator = require('otp-generator');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_SID
const client = require('twilio')(accountSid, authToken,serviceId);
const {userModule} = require('../model');

const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets:false,digits:true});

module.exports = {
    
    async emailOtp(to_email){
        const message = {
        from: process.env.SENDGRID_FROM_EMAIL,
        to: to_email,
        subject:"OTP for login in E-commerce",
        text: `Your OTP for E-commerce login is ${otp} . Please don't share this otp with anyone.`  
        };
        console.log("Message is ::::",message);
        await userModule.updateUser({otp:otp});
        sgMail.send(message);
    },

    async mobileOtp(mobile_number){
        return await client.verify.services(serviceId)
        .verifications
        .create({to: mobile_number, channel: 'sms',locale:'en'})
        // .then(verification => console.log(verification));
        
    },

    async verifyMobileOtp(mobile_number, otp){

        return await client.verify.services(serviceId)
        .verificationChecks
        .create({to: mobile_number, code: otp})
        // .catch(e => {
        //     console.log(e)
        // });   
        
    },
    
    async sendCredentiaToShipper(to_email,Password){
        const message = {
        from: process.env.SENDGRID_FROM_EMAIL,
        to: to_email,
        subject:"Login credentials of your account",
        text: `Here is your login credentials for shipper account. \n Username : ${to_email} \n Password : ${Password} `  
        };
        console.log("Message is ::::",message);;
        sgMail.send(message);
    },

}


