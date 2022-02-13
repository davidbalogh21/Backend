const express = require('express');
const router = express.Router();

const { register, login, forgotPassword, resetPassword, getUser } = require('../controllers/auth');

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").put(resetPassword);
router.route("/getUser").get(getUser);

module.exports = router;