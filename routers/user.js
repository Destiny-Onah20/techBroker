const express = require("express");
const { signUpUs, verifyUser, forgotPassword, changePassword, loginUser } = require("../controllers/user")

const userRoute = express.Router();

userRoute.route("/signup/user").post(signUpUs);
userRoute.route("/user/login").post(loginUser);
userRoute.route("/verify/:userId").post(verifyUser)
userRoute.route("/forget").post(forgotPassword)
userRoute.route("/changepwd/:userId").post(changePassword)

module.exports = userRoute;