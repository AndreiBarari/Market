const express = require('express');
const router = express.Router({ mergeParams: true });

// const { productSchema } = require('../schemas');
const { isAuthor, validateProduct } = require('../middleware');
const Farm = require('../models/farm');
const Product = require('../models/product');
const products = require('../controllers/products');

const catchAsync = require('../utilities/catchAsync');
// const ExpressError = require('../utilities/ExpressError');


router.post('/',
    isAuthor,
    validateProduct,
    catchAsync(products.createProduct));

 router.delete('/:productId',
    isAuthor,
    catchAsync(products.deleteProduct));

 module.exports = router;