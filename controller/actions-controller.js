const User = require('./../models/user-model');
const Reviews = require('./../models/reviews-model');
const Games = require('../models/games-model');

const DoUserReviewedthegame = async (userId, gameId) => {

    const Review = await Reviews.findOne({
        commentedGameId: gameId,
        createdBy: userId
    });
    if(Review){return true}else{return false}
};
exports.postReview = async (req,res)=> {
    
    //check if game exists
    const Game = await Games.findById(req.body.gameId)
    if(!Game){
        return res.status(200).json({
            status: "fail",
            message: "Game not found"
        })
    };
    
    //post reviews
    const createdReview = await Reviews.create({
        createdBy: req.user._id,
        commentedGameId: req.body.gameId,
        text: req.body.text,
        stars: req.body.stars
    });

    res.status(200).json({
        status: "succes",
        createdReview
    })
};

exports.deleteReview = async(req,res)=> {
    const value = await DoUserReviewedthegame(req.user._id,req.body.gameId);
    if(value===false){
        return res.status(400).json({
            status: "fail",
            message: "You cant delete a retweet that dont exists"
        })
    };

    await Reviews.deleteOne({
        commentedGameId: req.body.gameId,
        createdBy: req.user._id
    });
        
    res.status(200).json({
        status: "comment deleted succesfully"
    });
};

exports.getGameReviews = async(req,res)=> {
    //check if game exists
    const Game = await Games.findById(req.params.gameId)
    if(!Game){
        return res.status(200).json({
            status: "fail",
            message: "Game not found"
        })
    };

    //get game reviews
    const gameReviews = await Reviews.find({
        commentedGameId:req.params.gameId
    });
    
    res.status(200).json({
        status: "succes",
        gameReviews
    });
};

exports.updateReview = (req,res)=> {
    console.log("update route working");

    res.status(200).json({
        status: "succes"
    });
};

