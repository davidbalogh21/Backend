const express = require('express');
const router = express.Router();

const { addComment, likeComment, getComment } = require('../controllers/comment');

router.route("/addComment").post(addComment);
router.route("/getComment").get(getComment);
router.route("/likeComment").post(likeComment);

module.exports = router;