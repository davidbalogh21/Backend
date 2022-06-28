const Review = require('../models/Review');
const User = require('../models/User');
const Comment = require('../models/Comment');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');
const axios = require("axios");

exports.addComment = async (req, res, next) => {
    const {review_id, user_id, description, username} = req.body;
    const date = Date.now();
    let sentimentScore;

    try {
        const review = await Review.findOne({_id: review_id});

        if (!review) {
            return next(new ErrorResponse("Review not found!", 404));
        }

        const encodedParams = new URLSearchParams();
        encodedParams.append("text", description);

        const options = {
            method: 'POST',
            url: 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com',
                'X-RapidAPI-Key': process.env.API_KEY,
            },
            data: encodedParams
        };

        await axios.request(options).then(function (response) {
            sentimentScore = response.data.score;
        }).catch(function (error) {
            console.error(error);
        });

        const comment = await Comment.create({
            user_id, username, sentimentScore, description, date
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

exports.getComment = async (req, res, next) => {
    const {comment_id} = req.query;

    try {
        const comment = await Comment.findOne({_id: comment_id});

        if (!comment) {
            return next(new ErrorResponse("Review not found!", 404));
        }

        res.status(201).json({
            success: true,
            comment
        })
    } catch (error) {
        next(error);
    }
}

exports.likeComment = async (req, res, next) => {
    const {comment_id, user_id, review_id} = req.body;

    try {
        const comment = await Comment.findOne({_id: comment_id});
        const user = await User.findOne({_id: user_id});
        const review = await Review.findOne({_id: review_id});

        if (!comment || !user || !review) {
            return next(new ErrorResponse("Comment or user not found!", 404));
        }

        const userFound = comment.likes.find(userLike => userLike.email == user.email);

        if (userFound) {
            comment.likes.pop({_id: user_id});
        } else {
            comment.likes.push(user);
        }
        await comment.save();

        const commentFound = review.comments.find(commentArray => commentArray?._id == comment_id)
        console.log(commentFound);
        const commentUserFound = commentFound.likes.find(userCommentLike => userCommentLike.email == user.email);

        if (commentUserFound) {
            commentFound.likes.pop({_id: user_id});
        } else {
            commentFound.likes.push(user);
        }
        await review.save();

        res.status(201).json({
            success: true,
            comment,
            review
        })
    } catch (error) {
        next(error);
    }
}