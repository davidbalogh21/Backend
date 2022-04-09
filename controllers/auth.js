const User = require('../models/User');
const {json} = require("express");
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    const {username, email, password} = req.body;
    const date = Date.now();

    try {
        const user = await User.create({
            username, email, password, date
        })
        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password!", 400));
    }

    try {
        const user = await User.findOne({email}).select("+password");

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 404));
        }

        const passwordMatch = await user.matchPasswords(password);

        if (!passwordMatch) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        sendToken(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}

exports.forgotPassword = async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return next(new ErrorResponse("Email not registered!", 404));
        }

        const resetToken = user.getResetToken();
        await user.save();

        const resetUrl = `http://localhost:3000/reset/${resetToken}`

        const message = `
            <h1>You have requested a password reset</h1>
            <p> Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: "Password reset",
                text: message,
            }) ;

            res.status(200).json({
                success:true,
                data: "Email sent!"
            })


        } catch (e) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();
            return next(new ErrorResponse("Email could not be sent"), 500);
        }
    } catch (e) {
        next(e);
    }
}

exports.resetPassword = async (req, res, next) => {
    const resetToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user) {
            return next(new ErrorResponse("Invalid reset token", 400));
        }

        user.password = req.body.password;
        user.resetPassWordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Successful password reset"
        })
    } catch (e) {
        next(e);
    }
}

exports.getUser = async (req, res, next) => {
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

            return res.status(200).json({
                success: true,
                data: user
            });
        };
    }
    return res.send(500);
};

exports.getUserById = async (req, res, next) => {
    const {user_id} = req.body;

    try {
        const user = await User.findOne({_id: user_id});

        if (!user) {
            return next(new ErrorResponse("User not found!", 404));
        }

        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}

exports.followUser = async (req, res, next) => {
    const {user_id, follow_id} = req.body;

    try {
        const user = await User.findOne({_id: user_id});
        const followedUser = await User.findOne({_id: follow_id});

        if (!user || !followedUser) {
            return next(new ErrorResponse("User not found!", 404));
        }

        const followedUserFound = await user.follows.find(userFindFollowed => userFindFollowed.email == followedUser.email);
        if (followedUserFound) {
            user.follows.pop({_id: follow_id});
        } else {
            user.follows.push(followedUser);
        }
        await user.save();

        res.status(201).json({
            success: true,
            user,
        })
    } catch (error) {
        next(error);
    }
}

exports.getFollowedBy = async (req, res, next) => {
    const { user_id } = req.query;

    try {
        const user = await User.findOne({_id: user_id});

        if (!user) {
            return next(new ErrorResponse("User not found!", 404));
        }

        const usersWhoFollow = await User.find({"follows.username": user.username})

        res.status(201).json({
            success: true,
            usersWhoFollow
        })
    } catch (error) {
        next(error);
    }
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({
        success: true,
        token
    })
}