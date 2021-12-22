const mongoose = require("mongoose");
const submissionSchema = mongoose.Schema({
    assignment_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Assignment"
    },
    assignment_description:{
        type:String
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    submission_status: {
        type: String,
        default: "PENDING", // Pending, Submitted
    },
    submission_date: {
        type: Date,
        default:Date.now()
    },
    remark: {
        type: String,
        default: "",
    },
    submission_url:{
        type:String,
        default:""
    }
});
module.exports = mongoose.model("Submission", submissionSchema);
