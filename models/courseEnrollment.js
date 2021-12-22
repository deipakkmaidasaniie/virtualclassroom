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
