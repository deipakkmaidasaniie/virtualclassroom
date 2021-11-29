const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const studentController = require("../controllers/student");
app.post("/enroll",authenticateToken,studentController.registerCourse);
module.exports=app;