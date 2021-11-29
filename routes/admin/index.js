const express = require('express');
const ROUTE = express.Router();
const adminController = require('../../controller/admin/admin'); 

ROUTE.post('/sign-up',adminController.signUp);
ROUTE.post('/login',adminController.login);
ROUTE.get('get-all-user',adminController.allUser);

module.exports = ROUTE;