const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./Config.env" });
const app = express();
port = 5000;

// app.use(require('./router/auth'))
// app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
app.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require("./router/auth"));
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

mongoose
// .connect("mongodb+srv://yashm13114:hOI4hv6W7V8y5gsm@cluster2.aqen1ny.mongodb.net/Project")
    .connect("mongodb://0.0.0.0:27017/Project")
    .then(() => {
        console.log("Connected to mongo");
    })
    .catch((err) => {
        console.log("error" + err);
    });

app.get("/", async(req, res) => {
    // res.cookie("test", "yash");
    token = await userlogin.generateAuthToken();
    console.log(token)
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true

    })
    res.send("hello");
    res.sendFile(__dirname + "./router/auth");
});

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});