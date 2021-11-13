const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const userController = require("../controllers/user");
app.post("/add-user", userController.signup);
app.post("/login", userController.login);
module.exports = app;
