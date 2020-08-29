
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
var User= require("../models/user.model")




const signToken = userID => {
    // this is the payload
    return JWT.sign({
        iss: "IASBSHVAC",
        sub: userID
    }, "IASBSHVAC", {
        expiresIn: "1h"
    });
    // should match with secretOrKey
}

exports.register = async (req, res) => {


    console.log("here in registeration.")

    const {
        username,
        password,
        role
    } = req.body;
    User.findOne({
        username
    }, (err, user) => {
        if (err) {
            res.status(500).json({
                message: {
                    msgBody: "Error has occured",
                    msgError: true
                }
            });
        }
        if (user) {
            res.status(400).json({
                message: {
                    msgBody: "Username is already taken.",
                    msgError: true
                }
            });
        } else {
            const newUser = new User({
                username,
                password,
                role
            });
            newUser.save(err => {
                if (err) {
                    res.status(500).json({
                        message: {
                            msgBody: "Error has occured",
                            msgError: true
                        }
                    });
                } else {
                    res.status(201).json({
                        message: {
                            msgBody: "Account successfully created.",
                            msgError: false
                        }
                    });
                }
            })
        }
    });

}

exports.login = async (req, res) => {
    console.log("In login")
    if (req.isAuthenticated()) {
        const {
            _id,
            username,
            role
        } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: true
        });
        res.status(200).json({
            isAuthenticated: true,
            user: {
                username,
                role
            }
        })
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('access_token');
    res.json({
        user: {
            username: "",
            role: ""
        },
        success: true
    })
}