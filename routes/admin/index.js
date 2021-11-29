const express = require('express');
const ROUTE = express.Router();
const adminController = require('../../controller/admin/admin');
const authorize = require('../../service/middleware')
const roles = require('../../service/roles') 

ROUTE.post('/sign-up',adminController.signUp);
ROUTE.post('/login',adminController.login);
ROUTE.get('/get-all-user',authorize(roles.Admin),adminController.allUser);

module.exports = ROUTE;