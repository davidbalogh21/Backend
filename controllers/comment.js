const Review = require('../models/Review');
const Comment = require('../models/Comment');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');

exports.addComment = async (req, res, next) => {
    const {review_id, user_id, description, username} = req.body;
    const date = Date.now();

    try {
        const review = await Review.findOne({_id: review_id});

        if (!review) {
            return next(new ErrorResponse("Review not found!", 404));
        }

        const comment = await Comment.create({
            user_id, username, description, date
        })

        review.comments.push(comment);
        await review.save();

        res.status(201).json({
            success: true,
            review
        })
    } catch (error) {
        next(error);
    }
}