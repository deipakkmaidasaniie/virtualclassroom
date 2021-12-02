const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const userController = require("../controllers/user");
app.post("/add-user", userController.signup);
app.post("/login", userController.login);
app.get("/teachers",userController.teachersList);
app.get("/courses",authenticateToken,userController.courses);
app.get("/students",authenticateToken,userController.studentsList);
module.exports = app;



// get:-retrieve
// post:- Insert new data
// put/patch:- update
// delete