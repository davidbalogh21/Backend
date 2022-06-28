const Review = require('../models/Review');
const User = require('../models/User');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

exports.getReviewsByUser = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).send(`unauthorized ${e.message}`);
        }
        const user = await User.findById(decoded.id)

        if (user) {
            try {
                const reviews = await Review.find({user_id: user._id});
                res.status(200).json({
                    success: true,
                    reviews
                })
            } catch (e) {
                next(e)
            }
        }
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

exports.getFeed = async (req, res, next) => {
    let feedReviews = []
    if (req.headers && req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1],
            decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).send(`unauthorized ${e.message}`);
        }
        const user = await User.findById(decoded.id)

        if (user) {
            for (const followedUser of user.follows) {
                const reviews = await Review.find({user_id: followedUser._id});
                feedReviews.push(reviews);
            }
        }
        const mergedFeed = [].concat.apply([], feedReviews);
        const sortCriteria = (a, b) => a.date < b.date ? 1 : -1;
        mergedFeed.sort(sortCriteria);
        res.status(201).json({
            success: true,
            feedReviews: mergedFeed
        })
    }
}

exports.getTrendingFeed = async (req, res, next) => {
    const sortCriteria = (a, b) => {
        const neutralCommentsA = a.comments.filter(comment => comment.sentimentScore > 0 && comment.sentimentScore < 0.5);
        const positiveCommentsA = neutralCommentsA.filter(comment => comment.sentimentScore > 0.5);

        const neutralCommentsB = b.comments.filter(comment => comment.sentimentScore > 0 && comment.sentimentScore < 0.5);
        const positiveCommentsB = neutralCommentsB.filter(comment => comment.sentimentScore > 0.5);

        return a.likes.length + 2 * neutralCommentsA.length + 3 * positiveCommentsA < b.likes.length + 2 * neutralCommentsB.length + 3 * positiveCommentsB ? 1 : -1;
    }

    try {
        const allReviews = await Review.find();
        const feedReviews = allReviews.sort(sortCriteria);
        res.status(200).json({
            success: true,
            feedReviews
        })
    } catch (e) {
        next(e);
    }
}

exports.getLikedReviews = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).send(`unauthorized ${e.message}`);
        }
        const user = await User.findById(decoded.id)

        if (user) {
            try {
                const reviews = await Review.find();
                const reviewsLikedByUser = reviews.filter(review => review.likes.findIndex(like => like.username == user.username) != -1)
                res.status(200).json({
                    success: true,
                    reviewsLikedByUser
                })
            } catch (e) {
                next(e)
            }
        }
    }
}

exports.getLikedReviewsByOtherUser = async (req, res, next) => {
    const {username} = req.body;
    const user = await User.findOne({username: username});

    if (user) {
        try {
            const reviews = await Review.find();
            const reviewsLikedByUser = reviews.filter(review => review.likes.findIndex(like => like.username == user.username) != -1)
            res.status(200).json({
                success: true,
                reviewsLikedByUser
            })
        } catch (e) {
            next(e)
        }
    }
}