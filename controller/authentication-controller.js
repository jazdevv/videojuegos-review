const User = require('./../models/user-model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {sendmail} = require('./../utils.js/sendemail');
//image handling
const multer  = require('multer');
const sharp = require('sharp');
fs = require('fs');
const path = require('path');



const SignJWT = (id) => {
    //sign and return jwt with the user._id,wich is created automatically when user created an its the id of the document created(unique id)
    return token = jwt.sign(
        {id:id,releasetokendate:Date.now()},
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        }
    )
}

const sendJWT = (user, statusCode, res ,message)=>{
    //get jwt token with user._id 
    const token = SignJWT(user._id);

    const cookieoptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure : false
    };
    //set the cookie at response so client recive and store it
    res.cookie("jwt", token,cookieoptions);
    console.log("yes")
    // res.redirect('/me')
    return res.status(200).json({
        status:"succes",
        message:message,
        jwt:token
    });
    
    console.log("no")
}

exports.signup = async (req,res)=>{
   try{ //console.log('creating user');
    if(req.body.name && req.body.password && req.body.passwordconfirm && req.body.email ){

        //console.log("creating user");

        //encrypt the password and password confirm with bhash
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password,salt);
        req.body.password = hashedpassword;
        const hashedpasswordconfirm = await bcrypt.hash(req.body.passwordconfirm,salt);
        req.body.passwordconfirm = hashedpasswordconfirm;
        
        //create user at database
        const user = await User.create({ //its a vulnerability create something with req.body without parse the data inside it or select it like in this example, because everyone can add info to the request body, so someone could add another parameter to hisself
            name:req.body.name, 
            password:req.body.password, 
            email:req.body.email, 
            passwordconfirm:req.body.passwordconfirm
        });
        //create url for confirm email
        const url = `${req.protocol}://${req.get('host')}/verifyemail/${user._id}`
        //send confirmation email
        sendmail(user,url,'verifyemail');
        //console.log(user)
        //crate the jwt token and send the response with it
        console.log('user created correctly')
        sendJWT(user, 200, res, "user created correctly");
        
        
    } else {
        res.status(400).json({
            status:'fail',
            message:" there are missing values",
        })
    }}catch(err){
        res.status(400).json({
            status: 'fail',
            error:`${err}`
        })
    }
};

exports.login = async (req,res)=>{
    try{//check if there is user and password
    if(!req.body.email || !req.body.password){
        res.status(406).json({
            status: 'error',
            message:'insert email and password to cointinue'
        })
    }
    //find user at database
    const user = await User.findOne({email:req.body.email});
    
    //compare the plain password and hashed password
    const result = bcrypt.compareSync(req.body.password,user.password)
    
    //check if user was found and if comparaison is true,else return error
    if(!user || result===false){
        return res.status(400).json({
            status:"error",
            message: 'the email or password is invalid'
        })
    }
    return sendJWT(user, 200, res, "user login succefully");}catch(err){
        console.log(err);
    }
    
};

exports.isLogin = async (req,res,next) => {
    
    try{
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            req.cookies.jwt = req.headers.authorization.split(' ')[1]};
        //if there is not jwt return return
        if(!req.cookies.jwt){return new Error('You need to be logged to acces this route')};
            
        //decode the jwt //decode sould be the id and the releasetokendate //if someone modifyed the token the signature will not be the same and it will return an error
        const decoded = await jwt.verify(req.cookies.jwt,process.env.JWT_SECRET);
        
        //find a user with that id and where the creation date of jwt be earlier than the password change time
        const user = await User.findOne({_id: decoded.id , passwordchangetat: {$lt : decoded.releasetokendate }})
        
        //if not user found return
        if(!user){{return new Error('Your jwt expired, please login again')};}
        
            
        req.user = user;

        next();
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:"Please login or signup",
            err
        })
    }
}

exports.verifyemail = async (req,res)=>{
    await User.updateOne({_id:req.params.userid},{"$set":{"emailconfirm":true}});
    res.status(200).json({
        status:"succes",
        message:"the email its been verified, now u can use your account"
    })
};


exports.forgotpassword = async (req,res)=>{
    console.log("Forgot Password");
    //check if we received an email
    if(!req.body.email){
        return res.status(400).json({
            status:"fail",
            message:"missing email for recovery the password"
        })
    };
    //get user by the email
    const user = await User.findOne({email:req.body.email});
    //set reset token, expire date of reset token and return the reset token
    user.getResetPasswordToken();
    user.save();
    //create the reset password url wich will be sent to the client email
    const url = `${req.protocol}://${req.get('host')}/forgotpassword/${user.resetpasswordtoken}`
    
    //send email to the client with reset token
    sendmail(user,url,'forgotpassword');
    res.status(200).json({
        status:"succes",
        message:"we have sended a recovery mail to your mail"
    })
};

exports.resetpassword = async (req, res) => {

    //CHECK IF USER ADDED THE PASSWORD AND PASSWORDCONFIRM FOR THE CHANGES 
    if(!req.body.password || !req.body.passwordconfirm) {
        return res.status(400).json({
            status:"fail",
            message:"Please, put password and confirmation password "})
    }

    //SEARCH THE USER BY THE PASSWORD RESET TOKEN 
    const user = await User.findOne({resetpasswordtoken:req.params.resettoken,resetpasswordtokenexpires:{$gt : Date.now()}});

    //CHECK IF THE USER WAS FOUND 
    if(!user){
        return res.status(400).json({
            status:"fail",
            message:"The 10 minutes of validity of the reset password link have already passed"})
    }

    //IF TGE USER WAS FOUND , CREATE THE HASHED PASSWORD AND PASSWORD CONFIRM
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(req.body.password,salt);
    passwordconfirm = await bcrypt.hash(req.body.passwordconfirm,salt);
    
    //UPDATE THE USER
    user.password = password;
    user.passwordconfirm = passwordconfirm;
    if(user.password != user.passwordconfirm){ return res.status(400).json({
        status:"fail",
        message:"password dont matches "})
    }
    user.resetpasswordtoken = undefined;
    user.resetpasswordtokenexpires = undefined;
    await user.save();

    //SEND THE RESPONSE
    res.status(200).json({
        status:"succes",
        message:"password changed properly"
    })
};

//multer config

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"));
    }
};

exports.imageUploader = multer({
    storage,
    fileFilter: filter,
    
});

exports.updateprofilepic = async function(req, res) {
    // req.file includes the buffer
    // path: where to store resized photo
    const path = `./uploads/profilepic/${req.user._id}.jpeg`
    console.log(path)

    // toFile() method stores the image on disk
    try{
        await sharp(req.file.buffer).resize(200,200).jpeg({ mozjpeg: true }).jpeg({quality: 50}).toFormat('jpeg').toFile(`${path}`);
    }catch(err){
        return res.status(400).json({status:"fail",message:"probably sending a bad photo format"});
    }

    await User.findByIdAndUpdate(req.user._id,{profileImage:path});
    
    res.status(200).json({
        status: "succes",
        path
    });
};

