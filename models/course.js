const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
    coursename: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now(),
    },
    capacity: {
        type: Number,
        default: false,
    },
    teacher: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    code: {
        type: String,
        default: Math.random().toString(16).substr(8),
    },
    isVisible:{//this can be changed to false for deleting the course
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model("Course", courseSchema);
