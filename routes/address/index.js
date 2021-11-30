const express = require('express');
const ROUTE = express.Router();
const addressController = require('../../controller/address/address');

ROUTE.post('/create-address',addressController.addAddress);
ROUTE.put('/update-address/:address_id',addressController.updateAddress);
ROUTE.delete('/remove-address/:address_id',addressController.removeAddress);
ROUTE.get('/get-all-address/:user_id',addressController.getAllAddress);
ROUTE.put('/make-default-address/:address_id',addressController.makeDefaultAddress);

module.exports = ROUTE;