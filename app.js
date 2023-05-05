const express = require("express");
const dotenv = require("dotenv");
const adminRoute = require("./routers/admin");
const userRoute = require("./routers/user");

const app = express();
app.use(express.json());

app.use("/api", adminRoute);
app.use("/api", userRoute)


module.exports = app;