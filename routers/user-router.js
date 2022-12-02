const express = require('express');
const user = require("./../controller/user-controller");
const authController = require('../controller/authentication-controller');
const User = require('../models/user-model');


const userRouter = express.Router();

userRouter.post('/signup',authController.signup);
userRouter.post('/login',authController.login);
userRouter.get('/verifyemail/:userid',authController.verifyemail);
//password forget and send link for reset password with the reset token to the email
userRouter.post('/forgotpassword',authController.forgotpassword);
// endpoint of reset password, where the server receives the newpassword and change it
userRouter.post('/resetpassword/:resettoken',authController.resetpassword);

module.exports = userRouter;