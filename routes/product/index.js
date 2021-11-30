const express = require('express');
const ROUTE = express.Router();
const productController = require('../../controller/product/product'); 
const authorize = require('../../service/middleware');
const roles = require('../../service/roles');
const upload = require('../../service/uploadImage');

ROUTE.post('/add-product',authorize(roles.Admin),upload.single('image'),productController.addProduct);//
ROUTE.get('/get-products/:category_id',authorize(roles.Admin),productController.getProducts);
ROUTE.delete('/remove-product/:product_id',authorize(roles.Admin),productController.removeProduct);

module.exports = ROUTE;