const express = require('express');
const ROUTE = express.Router();
const inventoryController = require('../../controller/inventory/inventory')
const authorize = require('../../service/middleware');
const roles = require('../../service/roles');

ROUTE.post('/add-inventory-quantity',inventoryController.addInInventory);//,authorize(roles.Admin)
ROUTE.get('/get-inventory-list',inventoryController.inventoryList);
module.exports = ROUTE;