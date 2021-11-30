const express = require('express');
const ROUTE = express.Router();
const shipperController = require('../../controller/shipper/shipper');
const authorize = require('../../service/middleware');
const roles = require('../../service/roles');

/************Admin related routes******* */
ROUTE.post('/create-shipper-account',shipperController.createShipper);
ROUTE.delete('/remove-shipper-account/:shipper_id',shipperController.removeShipper);
ROUTE.get('/get-all-shipper',shipperController.getallShipper);
ROUTE.get('/shipper-order-details',shipperController.shipperOrderDetails)

ROUTE.put('update-shipper-account/shipper_id',shipperController.updateShipper)
ROUTE.post('/set-availability',shipperController.setAvailability);

/************Shipper related routes******* */
ROUTE.post('/login',shipperController.login);
ROUTE.put('/update-shipper-password',authorize(roles.Shipper),shipperController.updatePassword);
ROUTE.put('/apply-for-leave',authorize(roles.Shipper),shipperController.applyLeaves);
ROUTE.put('/response-order-request/:order_id',authorize(roles.Shipper),shipperController.responseOrder);




module.exports = ROUTE;
