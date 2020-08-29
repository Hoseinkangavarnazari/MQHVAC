var express = require('express');
var webAPI_router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
var webAPI_controller = require('../controllers/webAPI.controller');

webAPI_router.post('/updatedata', webAPI_controller.updateData);
webAPI_router.post('/setSchedule', webAPI_controller.setSchedule)
webAPI_router.post('/emergencyCall', webAPI_controller.emergencyCall);
webAPI_router.post('/readlogs', webAPI_controller.readLogs);

// auth required section
webAPI_router.post('/authrequired', passport.authenticate('jwt', { session: false }),webAPI_controller.authrequired)

module.exports = webAPI_router;