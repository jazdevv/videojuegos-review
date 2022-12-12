const Games = require('../models/games-model');

exports.createGame = (req,res) => {
    const Games = require('../models/games-model');

exports.createGame = async (req,res) => {
    console.log(req.body.name)
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
};