const mongoose = require("mongoose");
const materialSchema = mongoose.Schema({
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Course"
    },
    description: {
        type: String,
        required: true,
    },
    publish_date: {
        type: Date,
        default:Date.now()
    },
    deadline: {
        type: Date,
    },
    material_type:{
        type: String,   //notes,assignment,quiz
        required: true,
    },
    url:{
        type: String,
        required: true,
    }
});
module.exports = mongoose.model("Material", materialSchema);
