const express = require('express');
const router = express.Router();

const { addReview, getReviewsByMovieId, getReviewById, getReviewsByUserId, getReviewsByUser, likeReview, getFeed, getTrendingFeed, getLikedReviews, getLikedReviewsByOtherUser } = require('../controllers/review');

router.route("/addReview").post(addReview);
router.route("/getReviewsByMovieId").post(getReviewsByMovieId);
router.route("/getReviewById").post(getReviewById);
router.route("/getReviewsByUserId").post(getReviewsByUserId);
router.route("/getReviewsByUser").get(getReviewsByUser);
router.route("/likeReview").post(likeReview);
router.route("/getFeed").get(getFeed);
router.route("/getTrendingFeed").get(getTrendingFeed);
router.route("/getLikedReviews").get(getLikedReviews);
router.route("/getLikedReviewsByOtherUser").post(getLikedReviewsByOtherUser);

module.exports = router;