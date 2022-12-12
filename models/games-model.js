const mongoose = require('mongoose');

const VideoJuegoSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.ObjectId, // Object of user who post the game (should be an admin???)
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1
    },
    portadapic: {
        type: String,
        default: './uploads/portadapic/default.jpeg',
    },
    description:{
        type: String,
        required: true
    },
    linkoficialpage:{
        type: String,
        default: ""
    },
    canyoubuyit: {
        type: String, //podria usar booleans (true,false),de momento creo que no aqui
        default: "yes",
        enum:["yes","no"],
        required: true
    },
    isbanned: {
        type: Boolean,
        default: false
    },
    slug:{
        type: String, 
        default: this.name 
    },
    avgStars:{
        type: Number,
        default: 0
    },
    numReviews:{
        type: Number,
        default: 0
    }
});

const VideoJuego = mongoose.model("videojuegos",VideoJuegoSchema);

module.exports = VideoJuego;