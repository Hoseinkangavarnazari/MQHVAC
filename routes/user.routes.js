const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
// const JWT = require("jsonwebtoken");
var user_controller = require('../controllers/user.controller');



/**
* @swagger
* /user/register:
*   post:
*     tags:
*       - Users
*     name: registeration
*     summary: to register an admin
*     responses:
*       200:
*         description: Admin successfully added to the database.
*       401:
*         description: No auth token
*/
userRouter.post('/register',user_controller.register);


userRouter.post('/login', passport.authenticate('local', { session: false }), user_controller.login);


userRouter.get('/logout', passport.authenticate('jwt', { session: false }), user_controller.logout);


module.exports = userRouter;