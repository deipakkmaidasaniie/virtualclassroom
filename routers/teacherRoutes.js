const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const teacherController = require("../controllers/teacher");
app.post('/course',authenticateToken,teacherController.createCourse);
app.patch('/updateCourse/:id',authenticateToken,teacherController.updateCourse);
app.delete('/deleteCourse/:id',authenticateToken,teacherController.deleteCourse);
module.exports=app;

//get:- for retrieving existing resources
//post:- for creating new resource
//put/patch:- for updating the resource
//delete:- for deleting the resource
