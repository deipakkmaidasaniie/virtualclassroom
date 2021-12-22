const Enrollment = require("../models/courseEnrollment");
const Course = require("../models/course");
const Assignment=require("../models/material")
const Submission=require("../models/submission");
const mongoose=require("mongoose");
const Material=require("../models/material");
const User=require("../models/user");

const notifier=require("node-notifier");

exports.registerCourse = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        const coursecode = req.body.coursecode;
        //console.log(coursecode);
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
       // console.log(courseName);
        let enrollmentRecord={
            coursename:courseName.coursename,
            teacher:courseName.teacher,
            creationDate:courseName.creationDate,
            courseid:courseName._id
        }
        enrollmentRecord.courseid=courseName._id;
        // console.log("record",record);
        // console.log("record.courses",record.courses);
        
        record.courses.push(enrollmentRecord);
        console.log(enrollmentRecord);
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
        notifier.notify({
            title:"Enrolled into the course",
            subtitle:"Tap to view the course",
            message:`${courseName.coursename} course enrolled successfully! Click here to view the details`,
            wait:true
        })
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
        console.log(data);
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
        console.log(courseid);
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
        return res.render(err);
        isSuccess = false;
        status = 501;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message: "error! Please try again later!!",
        });
    }
};

exports.people=async(req,res)=>{
    let isSuccess, status, data, message;
    try{
        let courseid=req.params.id;
        let studentsList=[];
        let enrollmentRecords=await Enrollment.find().populate('studentId');
        //console.log(enrollmentRecords);
        enrollmentRecords.forEach((record)=>{
            let studentCourses=record.courses;
            studentCourses.forEach((course)=>{
                if(course._id.toString()===courseid)
                {
                    console.log("entered",record);
                    studentsList.push(record.studentId.username);
                    console.log(record.studentId.username);
                }
            })

        });
        console.log(studentsList);
        res.render('peopleS',{
            cid:courseid,
            student:studentsList
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.assignment = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        if (!req.params.id) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Please select the assignment",
            });
        }
        let materialid = req.params.id;
        let material = await Material.findOne(
            {
                _id:materialid,
                material_type:"assignments"
            },
            {
                description: 1,
                publish_date: 1,
                url: 1,
            }
        );
        if (!material) {
           return res.render('assignmentSub');
        }
        let teacherName=await User.findOne({
            _id:req.user.userId
        },
        {
            username:1,
            _id:0
        });
        teacherName=teacherName.username;
        isSuccess = true;
        status = 200;
        data = material;
        console.log("description",material.description);
        res.render('assignmentSub',{
            description:material.description,
            aid:materialid,
            teacherName:teacherName
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

