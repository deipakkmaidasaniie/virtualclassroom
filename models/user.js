const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isTeacher: {
        type: Boolean,
        default: false,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    sem: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
       // required: true,
    },
    address: {
        type: String,
       // required: true,
    },
    phoneNo: {
        type: String,
      //  required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
