const express = require('express');
const user = require("./../controller/user-controller");
const authController = require('../controller/authentication-controller');
const actionsController = require('../controller/actions-controller');
const User = require('../models/user-model');


const actionsRouter = express.Router();
//upload image
actionsRouter.post('/updateprofilepic',authController.isLogin,authController.imageUploader.single('photo'),authController.updateprofilepic);

module.exports = actionsRouter;