const Review = require('../models/Review');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');

exports.addReview = async (req, res, next) => {
    const {movie_id, user_id, description, rating} = req.body;
    const date = Date.now();

    try {
        const review = await Review.create({
            movie_id, user_id, description, rating, date
        })
        res.status(201).json({
            success: true,
            review
        })
    } catch (error) {
        next(error);
    }
}