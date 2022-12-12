const Games = require('../models/games-model');

exports.createGame = async (req,res) => {

    console.log(req.body)
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
    const game = Games.findByID(req.params.gameId);
    
    //render frontend with this response , ejs
    res.render("game.ejs",game);
}