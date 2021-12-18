const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const teacherController = require("../controllers/teacher");
app.post('/course',authenticateToken,teacherController.createCourse);
app.get("/all-courses",authenticateToken,teacherController.courses);
app.patch('/updateCourse/:id',authenticateToken,teacherController.updateCourse);
app.delete('/deleteCourse/:id',authenticateToken,teacherController.deleteCourse);
app.post('/upload/:id',authenticateToken,teacherController.uploadMaterial);
app.patch('/editMaterial/:id',authenticateToken,teacherController.editMaterial);
app.delete('/deleteMaterial/:id',authenticateToken,teacherController.deleteMaterial);
app.patch('/editAssignment/:id',authenticateToken,teacherController.editMaterial);
app.delete('/deletAssignment/:id',authenticateToken,teacherController.deleteMaterial);
module.exports=app;

//get:- for retrieving existing resources
//post:- for creating new resource
//put/patch:- for updating the resource
//delete:- for deleting the resource
