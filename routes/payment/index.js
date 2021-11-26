const express = require('express');
const ROUTE = express.Router();
const paymentController = require('../../controller/payment/payment');

ROUTE.post('/create-payment',paymentController.makePayment);
ROUTE.get('/get-all-payment-list',paymentController.paymentHistory);

module.exports = ROUTE;