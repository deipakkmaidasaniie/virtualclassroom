const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const studentController = require("../controllers/student");
module.exports=app;