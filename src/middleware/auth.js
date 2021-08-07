const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => {
    try {
        console.log("entering to taking cookie token!!");
        const token = req.cookies.jwt;
        console.log("taking cookie token!!");
        const verifyUser = jwt.verify(token, "onlinejobportalbymanishandfriends");
        console.log("verifying token!!");
        const user = await Register.findOne({_id:verifyUser._id});

        req.token = token;
        req.user = user;

        next();

    } catch (error) {
        console.log("Not verified!!");
        res.send(error);
    }
}

module.exports = auth;