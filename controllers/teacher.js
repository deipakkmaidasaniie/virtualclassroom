const Course = require("../models/course");
const User = require("../models/user");
const Material=require("../models/material");
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
}

//update course-----------------------------------------------------------------------------------------
exports.updateCourse=async(req,res)=>{
    let isSuccess, status, data, message;
    try{
        let updatedCourse= req.body;
        const courseid = req.params.id;
        const updated = await Course.findByIdAndUpdate({_id:courseid}, updatedCourse, { useFindAndModify: false });
        if (!updated) {
            isSuccess = false;
            status = 501;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Error in updating the course!",
            });
        }
        isSuccess = true;
        status = 201;
        data = updatedCourse;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            user: data,
            message: "Course is updated successfully",
        });
    } catch (err) {
        console.log(err);
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't add new Course due to internal server error! Please try again later",
        });
    }
}
//update course ends--------------------------------------------------------------------------


//delete course--------------------------------------------------------------------------
exports.deleteCourse = async (req, res) => {
    let isSuccess, data, message, status;
    try {
        if (!req.params.id) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Please select  the course to delete",
            });
        }
        let courseid = req.params.id;
        //courseid = +courseid; // converting into number
        const deleteCourse = await Course.findByIdAndDelete(courseid);
        if (!deleteCourse) {
            isSuccess = false;
            status = 404;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message:
                    "Course doesn't exists for the given course id. Please select valid course.",
            });
        }
        isSuccess = true;
        data = deleteCourse;
        status = 200;
        message = "Course deleted";
        res.status(status).json({
            isSuccess: isSuccess,
            product: data,
            status: status,
            message: message,
        });
    } catch (err) {
        console.log(err);
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Error in deleting course due to internal server error. Please try again later",
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

exports.uploadMaterial=async(req,res)=>{
    let isSuccess, status, data, message;
    try {
        if (!req.params.id) {
            isSuccess = false;
            status = 404;
            return res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Please select  the course to upload material",
            });
        }
        let courseid = req.params.id;
        req.body.course_id=courseid;
        let newMaterial = await new Material(req.body);
        const added = await newMaterial.save();
        if (!added) {
            isSuccess = false;
            status = 501;
            res.status(status).json({
                isSuccess: isSuccess,
                status: status,
                message: "Error in adding material!",
            });
        }
        isSuccess = true;
        status = 201;
        data = newMaterial;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            material: data,
            message: "Material added successfully",
        });
    } catch (err) {
        isSuccess = false;
        status = 500;
        res.status(status).json({
            isSuccess: isSuccess,
            status: status,
            message:
                "Couldn't add new Material due to internal server error! Please try again later",
        });
    }   
}