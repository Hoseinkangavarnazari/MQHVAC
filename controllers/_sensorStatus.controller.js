var request = require("request");
var SensorStatus = require("../models/_SensorStatus.model");

/**
 * For security reasons we will use POST method instead of GET to
 * transmit the sensors data to the client.
 */


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/report
 * description: 
 * (1) finds related sensors to requested aid
 * (2) returns the latest sensor status for each of them
 */
exports.report = async(req, res) => {}


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/report_all
 * description: 
 * (1) returns the latest sensor status for each actuator and correspondig
 *     sensors
 */
exports.reportAll = async(req, res) => {}


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/today_history
 * description: 
 * (1) returns an array that contains data of each sensor for every 30 minutes
 *     in a day for requested aid
 */
exports.todayHisotry = async(req, res) => {}


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/today_history_all
 * description: 
 * (1) returns an array that contains data of each sensor for every 30 minutes
 *     in a day for all actuators
 */
exports.todayHisotryAll = async(req, res) => {}




/**
 * TODO:
 * Send history for specific range in timeline
 */