const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Course = require("../models/course");
const Enrollment = require("../models/courseEnrollment");
const Material = require("../models/material");
const Submission = require("../models/submission");
//const sendEmail=require("./sendEmail");
//signup
exports.signup = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        console.log(req.body);
        const password = req.body.password;
        const confirm_password = req.body.confirmpassword;
        if (password != confirm_password) {
            return res.status(400).render("register");
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        if(req.body.isTeacher==='teacher')
        req.body.isTeacher=true;
        else
        req.body.isTeacher=false;
        const newUser = new User(req.body);
        const added = await newUser.save();
        if (!added) {
            isSuccess = false;
            status = 501;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Error in adding user!",
            });
        }
        if (!req.body.isTeacher) {
            const enrollmentRecord = new Enrollment({
                studentId: added._id,
            });
            const addedRecord = await enrollmentRecord.save();
        }
        // isSuccess = true;
        // status = 201;
        // data = newUser;
        // res.status(status).json({
        //     isSuccess: isSuccess,
        //     status: status,
        //     user: data,
        //     message: "User added successfully",
        // });
        // const token = await added.generateAuthToken();
        //     res.cookie("jwt", token, {
        //         expires: new Date(Date.now() + 1000000),
        //         httpOnly: true,
        //         // secure:true   --uncomment this while production--
        //     });

        res.status(201).render("login");
    } catch (err) {
        console.log(err);
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't add new User due to internal server error! Please try again later",
        });
    }
};

//Authentication
exports.login = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let username = req.body.username;
        let password = req.body.password;
        // console.log(username);
        let userExists = await User.findOne({ username: username });
        if (!userExists) {
            isSuccess = false;
            status = 404;
            // res.status(status).json({
            //     isSuccess: isSuccess,
            //     status: status,
            //     message: "User does not exists!",
            // });
            return res.status(404).render("login");
        }
        if (userExists && bcrypt.compareSync(password, userExists.password)) {
            const USER_ACCESS_KEY = process.env.USER_ACCESS_KEY;
            const token = jwt.sign(
                {
                    userId: userExists.id,
                    isTutor: userExists.isTutor,
                },
                USER_ACCESS_KEY,
                { expiresIn: "1d" }
            );
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 90000000),
                httpOnly: true,
                // secure:true   --uncomment this while production--
            });
            isSuccess = true;
            status = 200;
            // res.status(status).json({
            //     isSuccess: isSuccess,
            //     status: status,
            //     token: token,
            //     message: "Authentication Successfull!",
            // });
            if (userExists.isTeacher) {
                res.status(200).redirect("/all-courses");
            } else {
                res.status(200).redirect("/course-list");
            }
        } else {
            isSuccess = false;
            status = 401;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Authentication failed! Invalid username or password",
            });
        }
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message: "Something went wrong, please try again later",
        });
    }
};

exports.teachersList = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let teachers = await User.find(
            { isTeacher: true },
            { _id: 1, username: 1 }
        );
        if (teachers.length === 0) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "teachers does not exist!",
            });
        }
        isSuccess = true;
        status = 200;
        data = teachers;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            teachers: data,
            message: "Teachers fetched successfully!",
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message: "Something went wrong, please try again later",
        });
    }
};

exports.studentsList = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let students = await User.find(
            { isTeacher: false },
            { _id: 1, username: 1 }
        );
        if (students.length === 0) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "students does not exist!",
            });
        }
        isSuccess = true;
        status = 200;
        data = students;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            students: data,
            message: "students fetched successfully!",
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message: "Something went wrong, please try again later",
        });
    }
};

exports.courses = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let courses = await Course.find();
        if (!courses) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "courses does not exist!",
            });
        }
        isSuccess = true;
        status = 200;
        data = courses;
        console.log(data);
        // res.status(status).json({
        //     isSuccess: isSuccess,
        //     status: status,
        //     courses: data,
        //     message: "courses list fetched!",
        // });
        res.render("dashboardStudent", {
            course: courses,
        });
    } catch (err) {
        isSuccess = false;
        status = 501;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            courses: data,
            message: "error! Please try again later!!",
        });
    }
};

//View Profile
exports.viewProfile = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let accDeatils = await User.findOne(
            { _id: req.user.userId },
            { password: 0 }
        );
        if (accDeatils.length === 0) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "No such User exists !",
            });
        }
        isSuccess = true;
        status = 200;
        data = accDeatils;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            courses: data,
            message: "Profile feteched successfully!",
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't fetch profile due to internal server error! Please try again later",
        });
    }
};

//Edit Profile
exports.editProfile = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let updateProfile = req.body;
        const userId = req.user.userId;
        const updated = await User.findByIdAndUpdate(
            { _id: userId },
            updateProfile,
            { useFindAndModify: false }
        );
        if (!updated) {
            isSuccess = false;
            status = 501;
            // res.status(status).json({
            //     isSuccess: isSuccess,
            //     status: status,
            //     message: "Error in updating the Profile!",
            // });
           
        }
        isSuccess = true;
        status = 201;
        data = updated;
        // res.status(status).json({
        //     isSuccess: isSuccess,
        //     status: status,
        //     user: data,
        //     message: "Profile is updated successfully",
        // });
        return res.render("edit-profile");
    } catch (err) {
        console.log(err);
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't update Profile due to internal server error! Please try again later",
        });
    }
};
//fetch course materials
exports.courseNotes = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        if (!req.params.id) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Please select  the course to fetch notes",
            });
        }
        let courseid = req.params.id;
        let notes = await Material.find(
            {
                material_type: "notes",
                course_id: courseid,
            },
            {
                description: 1,
                publish_date: 1,
                url: 1,
                _id: 0,
            }
        );
        if (!notes) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "notes does not exist in this course!",
            });
        }
        isSuccess = true;
        status = 200;
        data = notes;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            notes: data,
            message: "notes list fetched!",
        });
    } catch (err) {
        console.log(err);
        isSuccess = false;
        status = 501;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message: "error! Please try again later!!",
        });
    }
};

exports.assignments = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        if (!req.params.id) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Please select  the course to fetch assignments",
            });
        }
        let courseid = req.params.id;
        let assignments = await Material.find(
            {
                material_type: "assignments",
                course_id: courseid,
            },
            {
                description: 1,
                publish_date: 1,
                url: 1,
                _id: 0,
            }
        );
        if (!assignments) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "assignments does not exist in this course!",
            });
        }
        isSuccess = true;
        status = 200;
        data = assignments;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            assignments: data,
            message: "assignments list fetched!",
        });
    } catch (err) {
        console.log(err);
        isSuccess = false;
        status = 501;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message: "error! Please try again later!!",
        });
    }
};


exports.submissions = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let submissionList = await Submission.find({
            submission_status: "SUBMITTED",
            studentId: req.user.userId,
        });
        if (submissionList.length === 0) {
            isSuccess = false;
            status = 404;
            // res.status(status).json({
            //     isSuccess: isSuccess,
            //     status: status,
            //     message: "materials does not exist in this course!",
            // });
            return res.render("classworkS", {
                submission: submissionList,
            });
        }
        isSuccess = true;
        status = 200;
        data = submissionList;

        // res.status(status).json({
        //     isSuccess: isSuccess,
        //     status: status,
        //     materials: data,
        //     message: "materials list fetched!",
        // });
        console.log(submissionList);
        res.render("classworkS", {
            submission: submissionList,
        });
    } catch (err) {
        console.log(err);
    }
};

/*
---Common APIs---
Register ✔
Login✔
Edit Profile
Fetch courses ✔
Fetch Student List ✔ (this should be poeple's list)
Fetch Course Material
Fetch Assignments
*/
