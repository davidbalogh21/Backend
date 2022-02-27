const express = require('express');
const router = express.Router();

const { addReview, getReviewsByMovieId, getReviewById } = require('../controllers/review');

router.route("/addReview").post(addReview);
router.route("/getReviewsByMovieId").post(getReviewsByMovieId);
router.route("/getReviewById").post(getReviewById);

module.exports = router;