require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose');
const app = express();
app.use(require('cors')())
app.use(express.json());
app.use(morgan('dev'))


/* Connection to Database */
mongoose
.connect(process.env.Mongo_Connection, {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => {
console.log('Successfully connected to the database')
})
.catch(err => {
console.log('Could not connect to the database. Exiting now...', err)
process.exit()
})

const ADMIN_ROUTES = require('./routes/admin');
const USER_ROUTES = require('./routes/user');
const CATEGORY_ROUTES = require('./routes/category');
const PRODUCT_ROUTES = require('./routes/product');
const CART_ROUTES = require('./routes/cart');
const WISHLIST_ROUTES = require('./routes/wishlist');
const INVENTORY_ROUTES = require('./routes/inventory');
const ADDRESS_ROUTES = require('./routes/address');
const SHIPPER_ROUTES = require('./routes/shipper');
const PAYMENT_ROUTES = require('./routes/payment');
const ORDER_ROUTES = require('./routes/order');

app.use('/admin',ADMIN_ROUTES);
app.use('/user',USER_ROUTES);
app.use('/category',CATEGORY_ROUTES);
app.use('/product',PRODUCT_ROUTES);
app.use('/cart',CART_ROUTES);
app.use('/wishlist',WISHLIST_ROUTES);
app.use('/inventory',INVENTORY_ROUTES);
app.use('/address',ADDRESS_ROUTES);
app.use('/shipper',SHIPPER_ROUTES);
app.use('/payment',PAYMENT_ROUTES);
app.use('/order',ORDER_ROUTES);

app.listen(process.env.PORT,()=>{
    console.log('Server is running on http://localhost:3005')
})