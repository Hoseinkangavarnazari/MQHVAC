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
        return new Date(year, month - 1, day, hour, min)
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

        let data = []

        let time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        for (var i = 0; i < msg.data.length; i++) {
            //drop objects with no data
            if (msg.data[i].temperature == "" || msg.data[i].humidity == "") {
                continue;
            }
            var tempdata = {
                sid: msg.data[i].sid,
                temperature: Number(msg.data[i].temperature),
                humidity: Number(msg.data[i].humidity)
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
    // similar implementation as report all
    // don't change it let them be identical

    aid = req.body.aid

    // use the data if they are for 30 minutes we had to get the 300 latest because of speed.
    // For example for 6 gateways with  1 min frequency : in 30 min -> 30 * 6 = 180  
    //  we have doubled it to make sure we can receive usefull information.
    let data = await SensorStatus.find({
        aid: aid
    }).sort({
        _id: -1
    }).limit(10);

    // make all gateways and correspondig sensors.
    let actuators = await Actuator.find({
        aid: aid
    });

    if (actuators.length == 0) {
        res.status(404).send("Requested Actuator doesn't exists in our database.");
        return;
    }

    let responseMessage = {}

    for (var i = 0; i < actuators.length; i++) {
        responseMessage[actuators[i].aid] = {};
        for (var j = 0; j < actuators[i].conf.sensorsList.length; j++) {
            responseMessage[actuators[i].aid][actuators[i].conf.sensorsList[j].sid] = {
                humidity: 0,
                temperature: 0,
                count: 0
            }
        }
    }


    // looks for a data reported at most 30 minutes before.
    var beforeTime = moment().subtract(30 * 60, 'second');
    var afterTime = moment();

    data.forEach(element => {
        var elemTime = moment(element.time);
        if (elemTime.isBetween(beforeTime, afterTime)) {
            console.log(`Valid range sensorTime: ${elemTime}`)
            let tempAid = element.aid;
            if (element.data == null) {
                return;
            }

            for (var i = 0; i < element.data.length; i++) {
                let tempSid = element.data[i].sid;

                if (typeof responseMessage[tempAid][tempSid] != "undefined") {
                    responseMessage[tempAid][tempSid].temperature += element.data[i].temperature;
                    responseMessage[tempAid][tempSid].humidity += element.data[i].humidity;
                    responseMessage[tempAid][tempSid].count += 1;
                } else {
                    console.log(`*** INVALID tempaid : ${tempAid} tempsid: ${tempSid}`)
                }
            }
        }
    });
    for (var tempActuator in responseMessage) {
        for (var tempSensor in responseMessage[tempActuator]) {
            if (typeof responseMessage[tempActuator][tempSensor] != "undefined") {
                if (responseMessage[tempActuator][tempSensor].count > 0) {
                    responseMessage[tempActuator][tempSensor].temperature /= responseMessage[tempActuator][tempSensor].count;
                    responseMessage[tempActuator][tempSensor].humidity /= responseMessage[tempActuator][tempSensor].count;
                } else {
                    responseMessage[tempActuator][tempSensor].temperature /= NaN;
                    responseMessage[tempActuator][tempSensor].humidity /= NaN;
                }
            }
        }
    }

    res.status(200).send(responseMessage);
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
                humidity: 0,
                temperature: 0,
                count: 0
            }
        }
    }


    // looks for a data reported at most 30 minutes before.
    var beforeTime = moment().subtract(30 * 60, 'second');
    var afterTime = moment();

    // add all data within the time range.
    data.forEach(element => {
        var elemTime = moment(element.time);
        if (elemTime.isBetween(beforeTime, afterTime)) {
            console.log(`Valid range sensorTime: ${elemTime}`)
            let tempAid = element.aid;
            if (element.data == null) {
                return;
            }

            for (var i = 0; i < element.data.length; i++) {
                let tempSid = element.data[i].sid;

                if (typeof responseMessage[tempAid][tempSid] != "undefined") {
                    responseMessage[tempAid][tempSid].temperature += element.data[i].temperature;
                    responseMessage[tempAid][tempSid].humidity += element.data[i].humidity;
                    responseMessage[tempAid][tempSid].count += 1;
                } else {
                    console.log(`*** INVALID tempaid : ${tempAid} tempsid: ${tempSid}`)
                }
            }
        }
    });

    // get average
    for (var tempActuator in responseMessage) {
        for (var tempSensor in responseMessage[tempActuator]) {
            if (typeof responseMessage[tempActuator][tempSensor] != "undefined") {
                if (responseMessage[tempActuator][tempSensor].count > 0) {
                    responseMessage[tempActuator][tempSensor].temperature /= responseMessage[tempActuator][tempSensor].count;
                    responseMessage[tempActuator][tempSensor].humidity /= responseMessage[tempActuator][tempSensor].count;
                } else {
                    responseMessage[tempActuator][tempSensor].temperature /= NaN;
                    responseMessage[tempActuator][tempSensor].humidity /= NaN;
                }
            }
        }
    }

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

    let actuators = await Actuator.find();
    let responseMessage = {}

    for (var i = 0; i < actuators.length; i++) {
        responseMessage[actuators[i].aid] = {};
        for (var j = 0; j < actuators[i].conf.sensorsList.length; j++) {
            responseMessage[actuators[i].aid][actuators[i].conf.sensorsList[j].sid] = {
                // we split the day into 48 half an hour
                humidity: Array(48).fill(0),
                temperature: Array(48).fill(0),
                count: Array(48).fill(0)
            }
        }
    }

    // you need to look at all the data you have 
    // if your frequency is every 5 minutes in every hour about 12 messages from each gateway
    // each day you have about 24*12*6 = 1728 messages
    // with this type of calculation, I consider about 1200 more messages as safety margin 
    // i.e., totally 3000 messages
    // I will look at latests 3000 messages in sensorStatus collection in order to provide this report]
    // TODO :  this method can be optimized
    let data = await SensorStatus.find().sort({
        _id: -1
    }).limit(3000);

    var today = moment();
    data.forEach(element => {
        // First check if this is for today


        if (today.isSame(moment(element.time), 'day')) {

            tempAid = element.aid;
            time = moment(element.time)
            minutesPassedToday = time.hours() * 60 + time.minutes()
            index = getCorrectInterval(minutesPassedToday);
            // for each sids
            sensorsData = element.data;
            if (sensorsData == null) {
                return;
            }

            for (var i = 0; i < sensorsData.length; i++) {
                let tempSid = sensorsData[i].sid;

                if (typeof responseMessage[tempAid][tempSid] != "undefined") {
                    responseMessage[tempAid][tempSid].temperature[index] += sensorsData[i].temperature;
                    responseMessage[tempAid][tempSid].humidity[index] += sensorsData[i].humidity;
                    responseMessage[tempAid][tempSid].count[index] += 1;
                } else {
                    console.log(`*** INVALID tempaid : ${tempAid} tempsid: ${tempSid}`)
                }
            }

        } else {
            return;
        }
    })

    // make the average
    // get average
    for (var tempActuator in responseMessage) {
        for (var tempSensor in responseMessage[tempActuator]) {
            if (typeof responseMessage[tempActuator][tempSensor] != "undefined") {
                for (var i = 0; i < 48; i++) {
                    if (responseMessage[tempActuator][tempSensor].count[i] > 0) {
                        responseMessage[tempActuator][tempSensor].temperature[i] /= responseMessage[tempActuator][tempSensor].count[i];
                        responseMessage[tempActuator][tempSensor].humidity[i] /= responseMessage[tempActuator][tempSensor].count[i];
                        //  round the values
                        responseMessage[tempActuator][tempSensor].temperature[i] = responseMessage[tempActuator][tempSensor].temperature[i].toPrecision(4);
                        responseMessage[tempActuator][tempSensor].humidity[i] = responseMessage[tempActuator][tempSensor].humidity[i].toPrecision(4);

                    } else {
                        responseMessage[tempActuator][tempSensor].temperature[i] /= NaN;
                        responseMessage[tempActuator][tempSensor].humidity[i] /= NaN;
                    }
                }

            }
        }
    }



    res.status(200).send(responseMessage);
}


/**
 * TODO:
 * Send history for specific range in timeline
 */


function getCorrectInterval(x) {
    return Math.floor(x / 30);
}