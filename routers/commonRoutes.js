const express = require("express");
const app = express.Router();
const authenticateToken = require("../middlewares/authenticate");
const userController = require("../controllers/user");
app.get("/add-user",(req,res)=>{
    res.render("register");
})
app.post("/add-user", userController.signup);

app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/login", userController.login);


app.get('/edit-profile',authenticateToken,(req,res)=>{
    res.render('edit-profile',{
    });
});
app.get("/teachers",userController.teachersList);
app.get("/courses",authenticateToken,userController.courses);
app.get("/students",authenticateToken,userController.studentsList);
app.patch('/edit-profile',authenticateToken,userController.editProfile);
app.get('/notes/:id',authenticateToken,userController.courseNotes);
app.get('/assignments/:id',authenticateToken,userController.assignments);// for getting all assignments of course
app.get('/profile',authenticateToken,userController.viewProfile);
app.get("/submissions",authenticateToken,userController.submissions);
module.exports = app;



// get:-retrieve
// post:- Insert new data
// put/patch:- update
// delete