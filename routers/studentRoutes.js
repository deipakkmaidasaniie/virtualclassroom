const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const studentController = require("../controllers/student");
app.post("/enroll",authenticateToken,studentController.registerCourse);
app.get("/course-list",authenticateToken,studentController.courses);
app.get('/course-materials/:id',authenticateToken,studentController.materials);
app.post("/submit-assignment/:id",authenticateToken,studentController.addSubmission);
app.get("/peopleS/:id",authenticateToken,studentController.people);
app.get('/assignment/:id',authenticateToken,studentController.assignment); // for getting particular assignment


module.exports=app;