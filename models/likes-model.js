const mongoose = require('mongoose');

const likesschema  = new mongoose.Schema({
    likedreview: {
        type: mongoose.ObjectId,
        required: true
    },
    userwholiked: {
        type: mongoose.ObjectId,
        required: true
    }
},{
    timestamps: true
});

const Like = mongoose.model("likes",likesschema);

module.exports = Like;