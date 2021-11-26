const express = require('express');
const router = express.Router();
const farms = require('../controllers/farms');
const { farmSchema } = require('../schemas');
const { isLoggedIn, isAuthor, validateForm } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Farm = require('../models/farm');

router.route('/')
    .get(catchAsync(farms.index))
    .post(isLoggedIn, upload.array('image'), validateForm, catchAsync(farms.createFarm))


router.get('/new', isLoggedIn, farms.newFarm);

router.route('/:id')
    .get(catchAsync(farms.showFarm))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateForm, catchAsync(farms.editFarm))
    .delete(isLoggedIn, isAuthor, catchAsync(farms.deleteFarm))

router.get('/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(farms.renderEdit));





module.exports = router;