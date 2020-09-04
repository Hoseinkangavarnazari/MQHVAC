var request = require("request");
var systemLog = require("../models/_SystemLog.model");

// MQTT ..........................................................

/**
 * Method: MQTT 3.1
 */
exports.saveLog = async (aid, log) => {
    console.log("aid",aid,"msg: ",log);

    try {
        // currently server time is considered
        // let time = msg.time
        // let time = new Date();
        var newLog = new systemLog({
            aid: aid,
            time: new Date(),
            level:log.level,
            description: log.description
        });

    } catch (err) {
        console.log("Something went wrong during saving new sensor data.", err)
    }

    try {
        newLog.save();
        console.log("Saved into the database.")

    } catch (err) {
        console.log("There is something wrong with saving to DB", err)
    }
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
exports.allLog = async(req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


/**
 * method: POST 
 * Auth: required
 * url: /system_log/reterive_all_unseen
 * description: 
 * (1) return unseen logs of all actuators
 */
exports.reteriveAllUnseen = async(req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


/**
 * method: POST 
 * Auth: required
 * url: /system_log/reterive_unseen
 * description: 
 * (1) return unseen logs of requested aid
 */
exports.reteriveUnseen = async(req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}



/**
 * method: POST 
 * Auth: required
 * url: /system_log/log
 * description: 
 * (1) returns all logs related for requested aid
 */
exports.log = async(req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


/**
 * method: PUT 
 * Auth: required
 * url: /system_log/seen_status
 * description: 
 * (1) seen or unseen an specific log
 */
exports.seenStatus = async(req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


// REST ...........................................................