const express = require('express');
const router = express.Router();

const { addComment } = require('../controllers/comment');

router.route("/addComment").post(addComment);

module.exports = router;