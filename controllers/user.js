const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Course = require("../models/course");
const Enrollment = require("../models/courseEnrollment");
//signup
exports.signup = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
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
        isSuccess = true;
        status = 201;
        data = newUser;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            user: data,
            message: "User added successfully",
        });
    } catch (err) {
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
        let userExists = await User.findOne({ username: username });
        if (!userExists) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "User does not exists!",
            });
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
            isSuccess = true;
            status = 200;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                token: token,
                message: "Authentication Successfull!",
            });
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
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            courses: data,
            message: "courses list fetched!",
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
