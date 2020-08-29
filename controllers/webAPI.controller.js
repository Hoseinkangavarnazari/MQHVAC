var request = require("request");
var sensorStatus = require("../models/sensorStatus.model");
var schedule = require("../models/schedule.model");
var emergencyCall = require("../models/emergencyCall.model");
var logs = require("../models/log.model");
var admin = require("../models/admin.model");

const bcrypt = require("bcrypt");

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

exports.setSchedule = async(req, res) => {
    console.log("An schedule have been received. GID: ", req.body.GID);
    console.log("sunday", req.body.sunday);

    // save received Schedule first in Database ..........................................
    var newSchedule = new schedule({
        GID: req.body.GID,
        SJ: "S",
        saturday: req.body.saturday,
        sunday: req.body.sunday,
        monday: req.body.monday,
        tuesday: req.body.tuesday,
        wednesday: req.body.wednesday,
        thursday: req.body.thursday,
        friday: req.body.friday,
    });

    try {
        newSchedule.save();
        console.log(":::  Schedule has been saved into the database.");
    } catch (err) {
        res.send({
            status: "Failed to access database",
        });
        // there should be a log checker
        // You should stop the whole process here
        console.log("::: There is something wrong with saving in DB", err);
    }
    // [end]save received Schedule first in Database ..........................................

    // publish received shchedule to broker ...................................................
    var mqtttemp = require("mqtt");
    const mqtttempBroker = "mqtt://127.0.0.1";
    const options = {
        qos: 2,
    };
    var mqtttempClient = mqtttemp.connect(
        mqtttempBroker, {
            clientId: "mqttjs99",
        },
        options
    );

    mqtttempClient.publish(
        req.body.GID + "/schedule",
        JSON.stringify(req.body),
        options,
        (error) => {
            if (error) {
                console.log("there was an error: ", error);
            } else {
                console.log("Schedule published successfully");
            }
        }
    );

    // [end]publish received shchedule to broker ...................................................

    //send the result ..............................................................................
    res.send({
        status: "Schedule published successfully",
    });
};

exports.updateData = async(req, res) => {
    response = [];

    GIDLIST = ["g1f0", "g2f0"];

    // should be changed and read the list of GIDs from the database
    for (currentGID of GIDLIST) {
        sensorData = await sensorStatus
            .find({
                    GID: currentGID,
                },
                function(err, document) {
                    // five is number of sensors
                    var avgTemperature = new Array(5);
                    avgTemperature.fill(0);

                    var avgHumidity = new Array(5);
                    avgHumidity.fill(0);
                    for (x of document) {
                        tempSensors = x.sensors;
                        for (y of tempSensors) {
                            avgTemperature[y.SID] += y.temperature;
                            avgHumidity[y.SID] += y.humidity;
                        }
                    }

                    for (i = 0; i < avgTemperature.length; i++) {
                        avgTemperature[i] /= document.length;
                        avgHumidity[i] /= document.length;
                    }

                    let tempresponse = {
                        GID: currentGID,
                        avgTemperature: avgTemperature,
                        avgHumidity: avgHumidity,
                    };
                    response.push(tempresponse);
                }
            )
            .sort({
                _id: -1,
            })
            .limit(5);
    }

    // console.log(response)
    res.send(response);
    //return model
    // console.log("REQUEST gateway: " + req.body.requestedGateway)

    // let GID = req.body.requestedGateway;
    // let sensors = [
    //     { SID: 1, H: randomInt(10, 24), T: randomInt(1, 9) },
    //     { SID: 2, H: randomInt(10, 24), T: randomInt(1, 9) }
    // ]

    // res.send({
    //     "sensors": sensors
    // })
};

exports.emergencyCall = async(req, res) => {
    // for security reasons don't let setting SJ dirrectly

    //save the request into database
    var newEmergencyCall = new emergencyCall({
        GID: req.body.GID,
        SJ: "M",
        command: req.body.command,
    });

    try {
        newEmergencyCall.save();
        console.log(":::  Emergency call has been saved into the database.");
    } catch (err) {
        res.send({
            status: "Failed to access database",
        });
        // there should be a log checker
        // You should stop the whole process here
        console.log("::: There is something wrong with saving in DB", err);
    }

    // publish received emergency call to the broker ...................................................
    var mqtttemp = require("mqtt");
    const mqtttempBroker = "mqtt://127.0.0.1";
    const options = {
        qos: 2,
    };
    var mqtttempClient = mqtttemp.connect(
        mqtttempBroker, {
            clientId: "mqttjs99",
        },
        options
    );

    mqtttempClient.publish(
        req.body.GID + "/emergencycall",
        JSON.stringify(req.body),
        options,
        (error) => {
            if (error) {
                console.log("there was an error: ", error);
            } else {
                console.log("Emergency call published successfully");
            }
        }
    );
    res.send({
        status: "Emergency call published successfully",
    });
};

exports.readLogs = async(req, res) => {
    requestedGID = req.body.GID;

    // search for latest logs from the server
    readLogs = await logs
        .find({
                GID: requestedGID,
            },
            function(err, document) {
                if (err) {
                    console.log("There was an problem: ", err);
                }

                list = [];
                for (log in document) {
                    let tempLog = {};
                    tempLog["detail"] = document[parseInt(log)].detail;
                    tempLog["level"] = document[parseInt(log)].level;
                    tempLog["GID"] = document[parseInt(log)].GID;
                    tempLog["time"] = document[parseInt(log)].time;
                    list.push(tempLog);
                }

                // send this data to res
                res.send(JSON.stringify(list));
            }
        )
        .sort({
            _id: -1,
        })
        .limit(10);
};


exports.authrequired = async(req, res) => {
    res.send({msg:"You hit auth required"})
}