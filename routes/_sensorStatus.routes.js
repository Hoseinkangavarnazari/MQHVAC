var express = require('express');
var sensorStatus_router = express.Router();

const passport = require("passport");
const passportConfig = require("../passport");

var sensorStatus_controller = require('../controllers/_sensorStatus.controller');


// MQTT

var saveStatus = (aid, status) => {
    sensorStatus_controller.saveStatus(aid, status);
}

// // REST
// sensorStatus_router.post('/report',
// passport.authenticate('jwt', { session: false }),
// sensorStatus_controller.report);

// sensorStatus_router.post('/report_all',
// passport.authenticate('jwt', { session: false }),
// sensorStatus_controller.reportAll);


// sensorStatus_router.post('/today_history',
//     sensorStatus_controller.todayHisotry);


// sensorStatus_router.post('/today_history_all',
// passport.authenticate('jwt', { session: false }),
// sensorStatus_controller.todayHisotryAll);

sensorStatus_router.post('/today_report',
    sensorStatus_controller.todayReport);

sensorStatus_router.post('/day_report',
    sensorStatus_controller.dayReport);

sensorStatus_router.post('/month_report',
    sensorStatus_controller.monthReport);

sensorStatus_router.post('/latest_report',
    sensorStatus_controller.latestReport);

sensorStatus_router.post('/uptime_report',
    sensorStatus_controller.upTimeReport);


module.exports = {
    saveStatus,
    sensorStatus_router
}