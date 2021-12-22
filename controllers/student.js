const Enrollment = require("../models/courseEnrollment");
const Course = require("../models/course");
const Assignment=require("../models/material")
const Submission=require("../models/submission");
const mongoose=require("mongoose");
exports.registerCourse = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        const coursecode = req.body.coursecode;
        const courseName = await Course.findOne({ code: coursecode });
        if (!courseName) {
            isSuccess = false;
            status = 400;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message:
                    "No course exists with the following code! Please enter correct code",
            });
        }
        const record = await Enrollment.findOne({ studentId: req.user.userId });
        record.courses.push(courseName);
        const updatedRecord = await record.save();
        isSuccess = true;
        message = "Successfully Enrolled into course!";
        data = updatedRecord;
        status = 201;
        return res.status(status).json({
            isSuccess: isSuccess,
            message: message,
            data: data,
            status: status,
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't enroll into course due to internal server error! Please try again later",
        });
    }
};

exports.courses = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let studentId = req.user.userId;
        let courseList = await Enrollment.find(
            { studentId: studentId },
            { courses: 1, _id: 0 }
        );
        if (courseList.length === 0) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "You haven't enrolled into any courses!",
            });
        }
        isSuccess = true;
        status = 200;
        data = courseList[0].courses;
        // res.status(status).json({
        //     isSuccess: isSuccess,
        //     status: status,
        //     courses: data,
        //     message: "Courses feteched successfully!",
        // });
        res.render('dashboardStudent',{
            course:data
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't fetch courses due to internal server error! Please try again later",
        });
    }
};

//submit assignment
exports.addSubmission = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        if (req.user.isTeacher) {
            isSuccess = false;
            status = 401;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Access Denied!",
            });
        }

        let id = req.params.id;
        if (!id) {
            isSuccess = false;
            status = 400;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Please enter assignment Id!",
            });
        }
        let assignment = await Assignment.findById(id);
        if (!assignment) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Assignment doesn't exists!",
            });
        }
        let currDate = new Date();
        let publishDate = assignment.publish_date;
        let deadline = assignment.deadline;

        if (currDate < publishDate) {
            isSuccess = false;
            status = 501;
            return res.status(404).json({
                isSuccess: isSuccess,
                status: status,
                message: "Assignment is not yet published!",
            });
        }

        if (currDate > deadline) {
            isSuccess = false;
            status = 501;
            return res.status(404).json({
                isSuccess: isSuccess,
                status: status,
                message:
                    "Assignment is overdue! You cannot submit assignment after the deadline.",
            });
        }
        let submission = await Submission.findOneAndUpdate(
            {
                assignment_id: id,
                student_id: req.user.userId,
                submission_status: "PENDING",
            },
            { submission_status: "SUBMITTED", submission_date: Date.now() },
            { new: true }
        );
        if (!submission) {
            isSuccess = false;
            status = 501;
            return res.status(404).json({
                isSuccess: isSuccess,
                status: status,
                message:
                    "Failed to submit assignment! Maybe the assignment is already submitted or has passed the deadline",
            });
        }
        isSuccess = true;
        status = 200;
        data = submission;
        res.status(status).json({
            isSuccess: isSuccess,
            submissionDetails: data,
            status: status,
            message: "Assignment submitted successfully",
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Assignment failed to be submitted due to internal server error!",
        });
    }
};
