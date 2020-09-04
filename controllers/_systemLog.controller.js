var request = require("request");
var SystemLog = require("../models/_SystemLog.model");

// MQTT ..........................................................

/**
 * Method: MQTT 3.1
 */
exports.saveLog = async (aid, log) => {
    console.log("aid",aid,"msg: ",log);
}

// MQTT ..........................................................


// REST ...........................................................

/**
 * For security reasons we will use POST method instead of GET to
 * transmit the sensors data to the client.
 */


/**
 * method: POST 
 * Auth: required
 * url: /system_log/all_log
 * description: 
 * (1) returns all logs related for all actuators
 */
exports.allLog = async(req, res) => {}


/**
 * method: POST 
 * Auth: required
 * url: /system_log/reterive_all_unseen
 * description: 
 * (1) return unseen logs of all actuators
 */
exports.reteriveAllUnseen = async(req, res) => {}


/**
 * method: POST 
 * Auth: required
 * url: /system_log/reterive_unseen
 * description: 
 * (1) return unseen logs of requested aid
 */
exports.reteriveUnseen = async(req, res) => {}



/**
 * method: POST 
 * Auth: required
 * url: /system_log/log
 * description: 
 * (1) returns all logs related for requested aid
 */
exports.log = async(req, res) => {}


/**
 * method: PUT 
 * Auth: required
 * url: /system_log/seen_status
 * description: 
 * (1) seen or unseen an specific log
 */
exports.seenStatus = async(req, res) => {}


// REST ...........................................................