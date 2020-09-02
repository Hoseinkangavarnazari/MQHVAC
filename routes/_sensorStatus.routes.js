var express = require('express');
var sensorStatus_router = express.Router();

const passport = require("passport");
const passportConfig = require("../passport");

var sensorStatus_controller = require('../controllers/_sensorStatus.controller');


// MQTT

var saveStatus = (aid, status) => { 
    sensorStatus_controller.saveStatus(aid, status);
 }

// REST
sensorStatus_router.post('/report',
passport.authenticate('jwt', { session: false }),
sensorStatus_controller.report);

sensorStatus_router.post('/report_all',
passport.authenticate('jwt', { session: false }),
sensorStatus_controller.reportAll);


sensorStatus_router.post('/today_history',
passport.authenticate('jwt', { session: false }),
sensorStatus_controller.todayHisotry);


sensorStatus_router.post('/today_history_all',
passport.authenticate('jwt', { session: false }),
sensorStatus_controller.todayHisotryAll);


module.exports = {
    saveStatus,
    sensorStatus_router
}