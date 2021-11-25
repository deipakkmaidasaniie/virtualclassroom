const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const teacherController = require("../controllers/teacher");
app.post('/course',authenticateToken,teacherController.createCourse);
module.exports=app;


//get:- for retrieving existing resources
//post:- for creating new resource
//put/patch:- for updating the resource
//delete:- for deleting the resource