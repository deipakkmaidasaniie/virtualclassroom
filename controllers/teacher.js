const Course = require("../models/course");
const User = require("../models/user");
exports.createCourse = async (req, res) => {
    let isSuccess, status, data, message;
    try {
        let newCourse = await new Course(req.body);
        const added = await newCourse.save();
        if (!added) {
            isSuccess = false;
            status = 501;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Error in adding course!",
            });
        }
        isSuccess = true;
        status = 201;
        data = newCourse;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            user: data,
            message: "Course added successfully",
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't add new Course due to internal server error! Please try again later",
        });
    }
};

exports.courses=async(req,res)=>{
    let isSuccess, status, data, message;
    try{
        let teacherName=await User.findOne({_id:req.user.userId},{_id:0,username:1});
        teacherName=teacherName.username;
        let courseList=await Course.find({teacher:teacherName});
        if (courseList.length === 0) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "You haven't created any courses!",
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
