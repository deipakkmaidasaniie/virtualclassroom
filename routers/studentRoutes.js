const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const studentController = require("../controllers/student");
app.post("/enroll",authenticateToken,studentController.registerCourse);
app.get("/course-list",authenticateToken,studentController.courses);
app.put("/submit-assignment/:id",authenticateToken,studentController.addSubmission);
module.exports=app;