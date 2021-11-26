const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user');
const users = require('../controllers/users')


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.userRegister));


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login' }), users.userLogin);

router.get('/logout', users.userLogout)

module.exports = router;