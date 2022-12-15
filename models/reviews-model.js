const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.ObjectId, // Object of user who post the review
        required: true
    },
    commentedPostId: {
        type: mongoose.ObjectId, // Object of user who post the review
        required: true
    },
    text: {
       required: true,
       type: String,
       minlenght: 1
    },
    stars:{
        required: true,
        min: 1,
        max: 5
    }
});

reviewsSchema.index({createdBy:-1,commentedPostId:-1},{unique: true});

const Reviews = mongoose.model("reviews",reviewsSchema);