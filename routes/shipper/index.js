const express = require('express');
const ROUTE = express.Router();
const shipperController = require('../../controller/shipper/shipper'); 

/************Admin related routes******* */
ROUTE.post('/create-shipper-account',shipperController.createShipper);
ROUTE.delete('/remove-shipper-account/:shipper_id',shipperController.removeShipper);
ROUTE.get('/get-all-shipper',shipperController.getallShipper);
ROUTE.put('/update-shipper-account/shipper_id',shipperController.updateShipper)
ROUTE.get('/shipper-order-details',shipperController.shipperOrderDetails)


/************Shipper related routes******* */
ROUTE.post('/login',shipperController.login);
ROUTE.put('/update-shipper-password/:shipper_id',shipperController.updatePassword);
ROUTE.put('/apply-for-leave/:shipper_id',shipperController.applyLeaves);

ROUTE.post('/set-availability',shipperController.test);

module.exports = ROUTE;
