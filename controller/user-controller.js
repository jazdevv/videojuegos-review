const User = require('./../models/user-model');
const fs = require('fs');
const path = require('path');
const { profile } = require('console');

exports.myprofile = (req,res)=>{
    console.log("me")
    const profilepicbuffer = fs.readFileSync(`${req.user.profileImage}`)
    const profilepic = Buffer.from(profilepicbuffer).toString('base64');
   const userclean = {
    name: req.user.name,
    usertag: req.user.usernametag,
    profilepic : profilepic
   }
   
   res.render('myprofile.ejs', {user:userclean});
}

exports.userprofile = async (req,res)=> {
    const user = await User.findOne({usernametag:req.params.userid});

    const profilepicbuffer = fs.readFileSync(`${req.user.profileImage}`)
    const profilepic = Buffer.from(profilepicbuffer).toString('base64');
    
    const userclean = {
        name: user.name,
        usertag: user.usernametag,
        profilepic : profilepic
    }

    res.render('myprofile.ejs', {user:userclean});
}