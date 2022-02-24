const Review = require('../models/Review');
const Comment = require('../models/Comment');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');

exports.addComment = async (req, res, next) => {
    const {review_id, user_id, description} = req.body;

    try {
        const review = await Review.findOne({review_id});

        if (!review) {
            return next(new ErrorResponse("Review not found!", 404));
        }

        const comment = await Comment.create({
            review_id, user_id, description
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