var request = require("request");
var SensorStatus = require("../models/_SensorStatus.model");
var Actuator = require("../models/_Actuator.model")

// gerneral time lib for

changeTime = (time) => {

    // let fullDateStr = "12/12/2012, 19:00";
    try {
    dateAndTime = time.split(", ");
    [day , month , year ]= dateAndTime[0].split("/");
    [hour, min] = dateAndTime[1].split(":")
    return new Date(year, month, day, hour, min)
    }
    catch (e){
        console.log(`Error ${e}`)
    }

}


// MQTT ..........................................................

/**
 * Method: MQTT 3.1
 */
exports.saveStatus = async (aid, msg) => {
    console.log("aid", aid, "msg: ", msg);
    try {
        // currently server time is considered
        // let time = msg.time
        // let time = new Date();
        let time = changeTime(msg.time);
        let data = []

        for (var i = 0; i < msg.data.length; i++) {
            var tempdata = {
                sid: msg.data[i].sid,
                temperature: msg.data[i].temperature,
                humidity: msg.data[i].humidity
            };
            data.push(tempdata);
        }

        var newStatus = new SensorStatus({
            aid: aid,
            time: time,
            data: data
        });
    } catch (err) {
        console.log("Something went wrong during saving new sensor data.", err)
    }

    try {
        newStatus.save();
        console.log("Saved into the database.")

    } catch (err) {
        console.log("There is something wrong with saving to DB", err)
    }
}

// MQTT ..........................................................




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
exports.report = async (req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/report_all
 * description: 
 * (1) returns the latest sensor status for each actuator and correspondig
 *     sensors
 */
exports.reportAll = async (req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/today_history
 * description: 
 * (1) returns an array that contains data of each sensor for every 30 minutes
 *     in a day for requested aid
 */
exports.todayHisotry = async (req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/today_history_all
 * description: 
 * (1) returns an array that contains data of each sensor for every 30 minutes
 *     in a day for all actuators
 */
exports.todayHisotryAll = async (req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");
}


/**
 * TODO:
 * Send history for specific range in timeline
 */