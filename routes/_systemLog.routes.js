/**
 * System log has 2 kinds of routes
 * First: receives data with MQTT from broker
 * Second: requests from Users to change or get the logs
 */
var express = require('express');
var systemLog_router = express.Router();

const passport = require("passport");
const passportConfig = require("../passport");

var systemLog_controller = require('../controllers/_systemLog.controller');



// MQTT

var saveLog = (aid, log) => { 
    systemLog_controller.saveLog(aid, log)
}


// REST
systemLog_router.post('/all_log',
passport.authenticate('jwt', { session: false }),
systemLog_controller.allLog);

systemLog_router.post('/reterive_all_unseen',
passport.authenticate('jwt', { session: false }),
systemLog_controller.reteriveAllUnseen);

systemLog_router.post('/reterive_unseen',
passport.authenticate('jwt', { session: false }),
systemLog_controller.reteriveUnseen);

systemLog_router.post('/log',
passport.authenticate('jwt', { session: false }),
systemLog_controller.log);

systemLog_router.put('/seen_status',
passport.authenticate('jwt', { session: false }),
systemLog_controller.seenStatus);

module.exports = {
    saveLog,
    systemLog_router
}

