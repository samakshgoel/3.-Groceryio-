const express = require('express');
const ROUTE = express.Router();
const wishlistController = require('../../controller/wishlist/wishlist');
const authorize = require('../../service/middleware');
const roles = require('../../service/roles');

ROUTE.post('/add-wishlist-product',wishlistController.addProduct);//,authorize(roles.User)
ROUTE.delete('/remove-wishlist-product',wishlistController.removeProduct)
ROUTE.get('/get-wishlist/:user_id',wishlistController.getWishlist);

module.exports = ROUTE;
