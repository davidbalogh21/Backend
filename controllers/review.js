const Review = require('../models/Review');
const User = require('../models/User');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

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

exports.likeReview = async (req, res, next) => {
    const {user_id, review_id} = req.body;

    try {
        const user = await User.findOne({_id: user_id});
        const review = await Review.findOne({_id: review_id});

        if (!user || !review) {
            return next(new ErrorResponse("Comment or user not found!", 404));
        }

        const userFound = review.likes.find(userLike => userLike.email == user.email);

        if (userFound) {
            review.likes.pop({_id: user_id});
        } else {
            review.likes.push(user);
        }

        await review.save();

        res.status(201).json({
            success: true,
            review
        })
    } catch (error) {
        next(error);
    }
}