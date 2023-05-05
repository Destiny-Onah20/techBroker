const express = require("express");
const { signUpAd, oneAdmin, loginAd } = require("../controllers/admin");

const adminRoute = express.Router();

adminRoute.route("/signup").post(signUpAd);
adminRoute.route("/admin/login").post(loginAd);
adminRoute.route("/admin/:userId").get(oneAdmin);

module.exports = adminRoute;