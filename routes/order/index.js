const express = require('express');
const ROUTE = express.Router();
const orderController = require('../../controller/order/order');

ROUTE.post('/create-order',orderController.createOrder);
ROUTE.put('/cancel-order/:order_id',orderController.cancelOrder);
ROUTE.put('/order-delivered/:order_id',orderController.orderdelivered);
ROUTE.get('/order-history',orderController.orderHistory);

module.exports = ROUTE;
