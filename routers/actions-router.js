const express = require('express');
const user = require("./../controller/user-controller");
const authController = require('../controller/authentication-controller');
const actionsController = require('../controller/actions-controller');
const User = require('../models/user-model');
const gamesController = require('../controller/games-controller');
const multer = require("multer");

const actionsRouter = express.Router();
//upload image
actionsRouter.post('/updateprofilepic',authController.isLogin,authController.imageUploader.single('photo'),authController.updateprofilepic);
//upload videojuego multer.none se encarga de pasar la form data a req.body para usarla pero solo text fields
actionsRouter.post('/postgame',multer().none(),authController.isLogin,gamesController.createGame);//falta poner restictTo admin maybe
//get a videojuego
actionsRouter.get("/game/:gameId",gamesController.getagame)
//delete a videojuego
actionsRouter.get("/gamedelete/:gameId",gamesController.deleteagame)
module.exports = actionsRouter;