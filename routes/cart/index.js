const express = require('express');
const ROUTE = express.Router();
const cartController = require('../../controller/cart/cart');
const authorize = require('../../service/middleware');
const roles = require('../../service/roles');

ROUTE.post('/add-product-cart',cartController.addProduct);//,authorize(roles.User)
ROUTE.delete('/remove-cart-product',cartController.removeProduct)
ROUTE.get('/get-cart/:user_id',cartController.getCart);

module.exports = ROUTE;
