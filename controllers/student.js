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
