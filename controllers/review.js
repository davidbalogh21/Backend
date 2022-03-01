const Review = require('../models/Review');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');

exports.addReview = async (req, res, next) => {
    const {movie_id, user_id, description, rating, title, username} = req.body;
    const date = Date.now();

    try {
        const review = await Review.create({
            movie_id, user_id, description, rating, date, title, username
        })
        res.status(201).json({
            success: true,
            review
        })
    } catch (error) {
        next(error);
    }
}

exports.getReviewsByMovieId = async (req, res, next) => {
  const {movie_id} = req.body;

  try {
      const reviews = await Review.find({movie_id});
      res.status(201).json({
          success: true,
          reviews
      })
  } catch (error) {
      next(error);
  }
};

exports.getReviewById = async (req, res, next) => {
  const {id} = req.body;

  try {
      const review = await Review.findOne({_id: id});
      res.status(201).json({
          success: true,
          review
      })
  } catch (error) {
      next(error);
  }
};

exports.getReviewsByUserId = async (req, res, next) => {
    const {id} = req.body;

    try {
        const reviews = await Review.find({user_id: id});
        res.status(201).json({
            success: true,
            reviews
        })
    } catch (error) {
        next(error);
    }
}