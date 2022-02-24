const express = require('express');
const router = express.Router();

const { addReview } = require('../controllers/review');

router.route("/addReview").post(addReview);

module.exports = router;