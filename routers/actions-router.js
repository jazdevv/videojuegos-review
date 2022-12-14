const express = require('express');
const user = require("./../controller/user-controller");
const authController = require('../controller/authentication-controller');
const actionsController = require('../controller/actions-controller');
const User = require('../models/user-model');
const gamesController = require('../controller/games-controller');
const multer = require("multer");

const actionsRouter = express.Router();


//----------USER ROUTES----------
//upload image
actionsRouter.post('/updateprofilepic',authController.isLogin,authController.imageUploader.single('photo'),authController.updateprofilepic);


//----------GAMES ROUTES----------
//upload videojuego multer.none se encarga de pasar la form data a req.body para usarla pero solo text fields
actionsRouter.post('/postgame',gamesController.multerPost.fields([
    {name:"createdBy",maxCount:1},
    {name:"name",maxCount:1},
    {name:"description",maxCount:1},
    {name:"linkoficialpage",maxCount:1},
    {name:"canyoubuyit",maxCount:1},
    {name:"image",maxCount:1}]),authController.isLogin,gamesController.createGame);//falta poner restictTo admin maybe
//get a videojuego
actionsRouter.get("/game/:gameId",gamesController.getagame);
//delete a videojuego
actionsRouter.get("/gamedelete/:gameId",gamesController.deleteagame);


//----------COMMENTS ROUTES----------
//post comment
actionsRouter.post("/postreview",authController.isLogin,actionsController.postReview);
//get comment
actionsRouter.get("/getgamereview/:gameId",authController.isLogin,actionsController.getGameReviews);
//delete comment
actionsRouter.post("/deletereview",authController.isLogin,actionsController.deleteReview);
//update comment
actionsRouter.post("/updatereview",authController.isLogin,actionsController.updateReview)

//----------LIKE A REVIEW----------
//like the review
actionsRouter.post("/like",authController.isLogin,actionsController.LikeunLikehandler)

module.exports = actionsRouter;