const express = require('express');
const user = require("./../controller/user-controller");
const authController = require('../controller/authentication-controller');
const { model } = require('mongoose');

const viewsRouter = express.Router();

//social media actions
//user profile
viewsRouter.get('/me',authController.isLogin,user.myprofile);
//see other user profile
viewsRouter.get('/user/:userid',authController.isLogin,user.userprofile);
//login
viewsRouter.get('/login',(req,res)=>{
    res.render('login.ejs')
});
//mainpage 
viewsRouter.get('/',(req,res)=>{
    res.status(200).json({
        status: "succes"
    })
});
module.exports = viewsRouter;