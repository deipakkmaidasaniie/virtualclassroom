const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const path=require("path");
const cookieparser=require('cookie-parser');
const hbs=require("handlebars");
require("dotenv/config");

//database connection
const mongo_uri = process.env.mongo_uri;
mongoose
    .connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database connected");
    })
    .catch((err) => {
        console.log(err);
    });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const publicpath =path.join(__dirname,"views");
//  app.use(express.static(publicpath));
 app.set('view engine','hbs');

 
 //console.log(assetspath);
app.use(morgan("tiny"));

const port = process.env.port;
app.listen(port || 5001, () => {
    console.log(`listening to ${port}`);
});
const userRouter = require("./routers/commonRoutes");
const studentRouter = require("./routers/studentRoutes");
const teacherRouter = require("./routers/teacherRoutes");

app.use("/", teacherRouter);
app.use("/", studentRouter);
app.use("/", userRouter);

const assetspath=path.join(__dirname,"assets");
 app.use(express.static(assetspath));
