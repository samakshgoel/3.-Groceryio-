const express = require('express');
const ROUTE = express.Router();
const categoryController = require('../../controller/category/category'); 
const authorize = require('../../service/middleware');
const roles = require('../../service/roles');

ROUTE.post('/add-category',authorize(roles.Admin),categoryController.addCategory);
ROUTE.get('/get-parents-category',categoryController.getParentsCategory);

module.exports = ROUTE;