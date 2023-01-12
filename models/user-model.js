const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlenght: 3
    },
    profileImage: {
        type: String,
        default: './uploads/profilepic/default.jpeg',
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum:['user','admin']
    },
    password:{
        type: String,
        trim: true,
        required: true,
        minlenght: 4,
        //select: false
    },
    passwordconfirm:{
        type: String,
        trim:true,
        required: true,
        select: false,
        validate: [function(pass){
            this.password === pass},'Password and Passwordconform match dont matches']},
            
    email:{
        unique: true,
        trim: true,
        type: String,
        required: true,
        minlenght:4,
        validate: [validator.isEmail, " This is not an email"]
    },
    emailconfirm:{//email confirm is  a boolean with  default value of false, wich that value change to true when the user confirm the email via the confirmation email it recieves
        type:Boolean,
        required:true,
        default: false
        
    },
    resetpasswordtoken:{
        type: String,
        default: undefined,
        required: false
    },
    resetpasswordtokenexpires:{
        type: Date,
        default: undefined,
        required: false
    },
    passwordchangetat: {
        type:Date,
        required:false
    },
    isBlocked: {
        type:Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true
})

// userschema.index({usernametag:1},{unique:true})
userschema.pre('save',function(next){
    if(this.isModified("password")){this.passwordchangetat = Date.now()};
    next();

});

userschema.methods.getResetPasswordToken = function() {
    this.resetpasswordtoken = crypto.randomBytes(20).toString('hex');
    this.resetpasswordtokenexpires = Date.now() + 10 * 60 * 1000; //expires in 10 mins
    
}; 

const User = mongoose.model('user', userschema);

module.exports = User;