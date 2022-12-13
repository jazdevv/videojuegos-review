const Games = require('../models/games-model');

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