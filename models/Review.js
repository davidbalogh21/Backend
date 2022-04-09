const mongoose = require('mongoose')
const Comment = require('../models/Comment');
const User = require('../models/User');

const ReviewSchema = new mongoose.Schema({
    movie_id: {
        type: String,
        required: [true, "Please provide a movie id"]
    },
    user_id: {
        type: String,
        required: [true, "Please provide a user id"]
    },
    username: {
        type: String,
        required: [true, "Please provide a review username"]
    },
    title: {
        type: String,
        required: [true, "Please provide a title"]
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
    likes: {
        type: [mongoose.Schema.Types.User]
    },
    comments: {
        type: [mongoose.Schema.Types.Comment]
    }
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;