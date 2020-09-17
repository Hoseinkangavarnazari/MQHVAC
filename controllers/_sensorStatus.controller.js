var request = require("request");
var SensorStatus = require("../models/_SensorStatus.model");
var Actuator = require("../models/_Actuator.model")
var moment = require('moment');

// gerneral time lib for

changeTime = (time) => {

    // let fullDateStr = "month/day/year, 19:00";
    try {
        dateAndTime = time.split(", ");
        [month, day, year] = dateAndTime[0].split("/");
        [hour, min] = dateAndTime[1].split(":")
        // console.log(new Date(year, month, day, hour, min))
        // in javascript month are in range 0 to 11
        return new Date(year, month-1, day, hour, min)
    } catch (e) {
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
        // the main solution
        // time = changeTime(msg.time);

        // test solution
        // let tt = new Date();
        // let time = new Date(tt.getFullYear(), tt.getMonth(), tt.getDate(),tt.getHours(), tt.getMinutes())  
        let data = []

        let time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

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
    // use the data if they are for 30 minutes we had to get the 300 latest because of speed.
    // For example for 6 gateways with  1 min frequency : in 30 min -> 30 * 6 = 180  
    //  we have doubled it to make sure we can receive usefull information.
    let data = await SensorStatus.find().sort({
        _id: -1
    }).limit(360);

    // make all gateways and correspondig sensors.
    let actuators = await Actuator.find();
    let responseMessage = {}

    for (var i = 0; i < actuators.length; i++) {
        responseMessage[actuators[i].aid] = {};
        for (var j = 0; j < actuators[i].conf.sensorsList.length; j++) {
            responseMessage[actuators[i].aid][actuators[i].conf.sensorsList[j].sid] = {
                humidity: -100,
                temperature: -100,
                count: 0
            }
        }
    }

    // how you want to fill them? 

    // var d1 = new Date();
    // var minTime = new Date(d1);
    // minTime.setMinutes(d1.getMinutes() - 60);
    // console.log(minTime.toTimeString());

    var beforeTime = moment().subtract(1*60, 'second');
    var afterTime = moment();

    data.forEach(element => {
        var elemTime = moment(element.time);
        if(elemTime.isBetween(beforeTime, afterTime)){
            console.log(`Valid range sensorTime: ${elemTime}`)
        }else
        {
            console.log(`Not in range sensorTime: ${elemTime}`)
        }


    });
    // console.log(data)



    res.status(200).send(responseMessage);
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