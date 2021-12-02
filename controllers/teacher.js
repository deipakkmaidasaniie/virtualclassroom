const Course=require('../models/course');

exports.createCourse=async(req,res)=>{
    let isSuccess, status, data, message;
    try{
        let newCourse=await new Course(req.body);
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

//update course
exports.updateCourse=async(req,res)=>{
    let isSuccess, status, data, message;
    try{
        let updatedCourse=await new Course(req.body);
        const id = req.params.coursename;
        const updated = await updatedCourse.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
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