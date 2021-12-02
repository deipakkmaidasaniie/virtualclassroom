const Enrollment = require("../models/courseEnrollment");
const Course = require("../models/course");
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
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "You haven't enrolled into any courses!",
            });
        }
        isSuccess = true;
        status = 200;
        data = courseList;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            courses: data,
            message: "Courses feteched successfully!",
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
