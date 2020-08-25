var express = require('express');
var webAPI_router = express.Router();

// Require controller modules.
var webAPI_controller = require('../controllers/webAPI.controller');


webAPI_router.post('/updatedata', webAPI_controller.updateData);
webAPI_router.post('/setSchedule',webAPI_controller.setSchedule)
webAPI_router.post('/emergencyCall', webAPI_controller.emergencyCall);
webAPI_router.post('/readlogs', webAPI_controller.readLogs);

// sign Up

// login

// rename password



module.exports = webAPI_router;