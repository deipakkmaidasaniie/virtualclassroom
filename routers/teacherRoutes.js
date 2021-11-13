const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const teacherController = require("../controllers/teacher");
module.exports=app;