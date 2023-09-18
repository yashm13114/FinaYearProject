const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserSchema = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const authenticate = require("../middleware/authenticate")
const DB = process.env.DATABASE;
// hOI4hv6W7V8y5gsm my pass
mongoose
// .connect("mongodb+srv://yashm13114:hOI4hv6W7V8y5gsm@cluster2.aqen1ny.mongodb.net/Project")
    .connect("mongodb://0.0.0.0:27017/Project")
    .then(() => {
        console.log("Connected to mongo");
    })
    .catch((err) => {
        console.log("error" + err);
    });
const User = require("../model/UserSchema");
router.use(cookieParser())
router.get("/", (req, res) => {
    res.send(`hello world router`);
});
router.get("/router", (req, res) => {
    res.send(`hello world router`);
});

router.post("/register", async(req, res) => {
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
        return res.json({ error: "plz fill it" });
    }
    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "email is already used" });
        }
        const user1 = new User({ name, email, password, cpassword });

        await user1.save();

        res.status(201).json({ message: "successfully" });
    } catch (err) {
        console.log(err);
    }
});

router.post("/login", async(req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter all the details" });
        }
        const userlogin = await UserSchema.findOne({ email: email });
        // console.log(userlogin)
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            token = await userlogin.generateAuthToken();
            console.log(token)
            res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true

                })
                // console.log(`this is cookie ${req.cookie.jwt()}`)

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials" });
            } else {
                res.json({ message: "logged in successfully" });
            }
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
});
router.get("/profile", (req, res) => {

    res.send(req.rootuser)
});
router.get("/logout", (req, res) => {
    res.clearCookie('jwt', { path: '/' })
    res.status(200).send("hello");
    // res.send(req.rootuser)
});


module.exports = router;