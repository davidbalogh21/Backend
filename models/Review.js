const mongoose = require('mongoose')
const Comment = require('../models/Comment');

const ReviewSchema = new mongoose.Schema({
    movie_id: {
        type: String,
        required: [true, "Please provide a movie id"]
    },
    user_id: {
        type: String,
        required: [true, "Please provide a user id"]
    },
    description: {
        type: String,
        required: [true, "Please provide a review"],
    },
    rating: {
        type: Number,
        required: [true, "Please provide a rating"],
    },
    date: {
        type: Date,
        default:Date.now()
    },
    comments: {
        type: [mongoose.Schema.Types.Comment]
    }
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;