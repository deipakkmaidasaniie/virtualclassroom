const mongoose = require("mongoose");
const courseEnrollmentSchema = mongoose.Schema({
    courses: {
        type: [
            {
                coursename: String,
            },
            {
                teacher:String
            },
            {
                creationDate: Date
            },
            {
                courseid:mongoose.Schema.Types.ObjectId,
            }
        ],
        default: null,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Enrollment", courseEnrollmentSchema);
