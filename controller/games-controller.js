const Games = require('../models/games-model');

//image handling
const multer  = require('multer');
const sharp = require('sharp');
fs = require('fs');
const path = require('path');

//-------------------------------POSTS MULTER FORM-DATA PARSER-------------------------------
//we dont use diskstorage, because we dont wanna automatically save the image, we want to use memorystorage because after we wanna use sharp
//for modyify the image and save the image from sharp


exports.multerPost =  multer({
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, cb) {
        //esto solo se ejecuta con los files, si hay un text en el field no se ejecutara pero seguira
        // console.log("hey")
        // console.log(file)
        if (file.fieldname ==="image"){
            console.log("image")
    
            if (file.mimetype.split("/")[0] === 'image') {
    
                cb(null, true);
    
            } else {
    
                cb(new Error("Only images are allowed!"));
                
            }
        }
    }
});

exports.createGame = async (req,res) => {

    console.log("create game")
    console.log(req.body)
    console.log("yo")
    const game = await Games.create({
        createdBy: req.user._id,
        name: req.body.name,
        description: req.body.description,
        linkoficialpage: req.body.linkoficialpage,
        canyoubuyit: req.body.canyoubuyit,
    })

    res.status(200).json({
        status: "succes",
        game
    });
};

exports.getagame = async (req,res)=>{
    const game = await Games.findOne({_id:req.params.gameId});
    if(game){
      //render frontend with this response , ejs
    res.render("game.ejs",{game:game});  
    }else{
        res.status(200).json({
            message:"game not found withthat id"
        })
    }
    
}

exports.deleteagame = async (req,res)=>{
    //console.log("removing")
    //console.log(req.params.gameId)
    const game = await Games.findOneAndRemove({_id:req.params.gameId});
    
    //render frontend with this response , ejs
    res.status(200).json({
        status: "deleted succes"
    })
}