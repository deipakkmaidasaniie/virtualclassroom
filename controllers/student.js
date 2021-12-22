const Enrollment = require("../models/courseEnrollment");
const Course = require("../models/course");
const Assignment=require("../models/material")
const Submission=require("../models/submission");
const mongoose=require("mongoose");
exports.registerCourse = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        const coursecode = req.body.coursecode;
        console.log(coursecode);
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
        console.log(courseName);
        let enrollmentRecord={
            coursename:courseName.coursename,
            teacher:courseName.teacher,
            creationDate:courseName.creationDate
        }
        record.courses.push(enrollmentRecord);
        const updatedRecord = await record.save();
        isSuccess = true;
        message = "Successfully Enrolled into course!";
        data = updatedRecord;
        status = 201;
        // return res.status(status).json({
        //     isSuccess: isSuccess,
        //     message: message,
        //     data: data,
        //     status: status,
        // });
        res.status(status).redirect("/course-list");
    } catch (err) {
        console.log(err);
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
            // return res.status(status).json({
            //     isSuccess: isSuccess,
            //     status: status,
            //     message: "You haven't enrolled into any courses!",
            // });
            
            return res.render('dashboardStudent',{
                course:courseList
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
                assignment_id:id,
                student_id: req.user.userId,
                submission_status: "PENDING",
            },
            { submission_status: "SUBMITTED", 
            submission_date: Date.now(),
            submission_url:req.body.suburl

         },
            { new: true }
        );
        console.log(submission);
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
        console.log("data is",data);
        data.description=assignment.description;
        // res.status(status).json({
        //     isSuccess: isSuccess,
        //     submissionDetails: data,
        //     status: status,
        //     message: "Assignment submitted successfully",
        // });
        res.render('assignmentSub',{
            aid:id
        })
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

exports.materials = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        if (!req.params.id) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Please select  the course to fetch materials",
            });
        }
        let courseid = req.params.id;
        let materials = await Material.find(
            {
                course_id: courseid,
            },
            {
                description: 1,
                publish_date: 1,
                deadline: 1,
                url: 1,
            }
        );
        if (!materials) {
            isSuccess = false;
            status = 404;
            // res.status(status).json({
            //     isSuccess: isSuccess,
            //     status: status,
            //     message: "materials does not exist in this course!",
            // });
            //console.log(courseid);
            return res.render("streamS", {
               //aid:materials,
                material: materials,
            });
        }
        isSuccess = true;
        status = 200;
        data = materials;
        // res.status(status).json({
        //     isSuccess: isSuccess,
        //     status: status,
        //     materials: data,
        //     message: "materials list fetched!",
        // });
        console.log(materials);
        res.render("streamS", {
            cid:courseid,
            material: materials,
        });
    } catch (err) {
        isSuccess = false;
        status = 501;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message: "error! Please try again later!!",
        });
    }
};

