const Games = require('../models/games-model');
const Utils = require('./../utils.js/utils')

exports.mainpage = async (req,res) => {

    const games = await Games.find();

    const {logguser} = await Utils.defaultpageThings(req.user._id)

    res.render("mainpage.ejs",(games,logguser))
}