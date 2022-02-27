const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, "Please provide a user id"]
    },
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    description: {
        type: String,
        required: [true, "Please provide a review"]
    },
    date: {
        type: Date,
        default:Date.now()
    }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;