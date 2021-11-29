const express = require('express');
const ROUTE = express.Router();
const userController = require('../../controller/user/user'); 

ROUTE.post('/sign-up',userController.signUp)
ROUTE.post('/login-otp',userController.loginWithOtp);
ROUTE.post('/verify-otp',userController.verifyOtp);

module.exports = ROUTE;