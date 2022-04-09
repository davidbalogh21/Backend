const express = require('express');
const router = express.Router();

const { addReview, getReviewsByMovieId, getReviewById, getReviewsByUserId, likeReview } = require('../controllers/review');

router.route("/addReview").post(addReview);
router.route("/getReviewsByMovieId").post(getReviewsByMovieId);
router.route("/getReviewById").post(getReviewById);
router.route("/getReviewsByUserId").post(getReviewsByUserId);
router.route("/likeReview").post(likeReview);

module.exports = router;