const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const studentController = require("../controllers/student");
app.post("/enroll",authenticateToken,studentController.registerCourse);
app.get("/course-list",authenticateToken,studentController.courses);
app.get('/materials/:id',authenticateToken,studentController.materials);
app.post("/submit-assignment/:id",authenticateToken,studentController.addSubmission);
app.get("/people/:id",authenticateToken,studentController.people);

module.exports=app;